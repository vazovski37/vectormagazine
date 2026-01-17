/**
 * ImageTune Class
 * Adds resizing options to the Image Block
 */
export default class ImageTune {
    api: any;
    data: any;
    config: any;
    block: any;
    buttons: { name: string; icon: string; title: string; value: string }[];
    wrapper: HTMLElement | undefined;

    static get isTune() {
        return true;
    }

    constructor({ api, data, config, block }: any) {
        this.api = api;
        this.data = {
            width: data?.width || '',
            height: data?.height || '',
        };
        this.config = config;
        this.block = block;

        this.buttons = [
            {
                name: 'width-100',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="5" width="16" height="10" rx="1" ry="1" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                title: '100% Width',
                value: '100%'
            },
            {
                name: 'width-75',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="5" width="12" height="10" rx="1" ry="1" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                title: '75% Width',
                value: '75%'
            },
            {
                name: 'width-50',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="5" width="8" height="10" rx="1" ry="1" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                title: '50% Width',
                value: '50%'
            },
            {
                name: 'width-25',
                icon: '<svg width="20" height="20" viewBox="0 0 20 20"><rect x="2" y="5" width="4" height="10" rx="1" ry="1" stroke="currentColor" fill="none" stroke-width="2"/></svg>',
                title: '25% Width',
                value: '25%'
            }
        ];
    }

    render() {
        const settingsWrapper = document.createElement('div');
        this.wrapper = settingsWrapper;

        // 1. Preset Buttons
        this.buttons.forEach(btn => {
            const button = document.createElement('div');
            button.classList.add('ce-popover-item');
            button.setAttribute('data-item-name', btn.name);
            button.title = btn.title;

            const icon = document.createElement('div');
            icon.classList.add('ce-popover-item__icon');
            icon.innerHTML = btn.icon;

            const label = document.createElement('div');
            label.classList.add('ce-popover-item__title');
            label.textContent = btn.title;

            button.appendChild(icon);
            button.appendChild(label);

            button.addEventListener('click', () => {
                this._updateData({ width: btn.value });
                // Clear custom input if preset matches
                const widthInput = settingsWrapper.querySelector('input[placeholder="auto"]') as HTMLInputElement;
                // Note: We might have multiple inputs with same placeholder, relying on order or better selectors would be ideal but this is quick fix
                // Let's just update the inputs if they exist
                const inputs = settingsWrapper.querySelectorAll('input');
                if (inputs.length > 0) inputs[0].value = btn.value;
            });

            // Highlight active
            if (this.data.width === btn.value) {
                button.classList.add('ce-popover-item--active');
            }

            settingsWrapper.appendChild(button);
        });

        // 2. Custom Inputs
        const inputContainer = document.createElement('div');
        inputContainer.style.padding = '10px';
        inputContainer.style.borderTop = '1px solid #eee';
        inputContainer.style.display = 'flex';
        inputContainer.style.flexDirection = 'column';
        inputContainer.style.gap = '8px';

        // Width Input
        const widthInput = this._createInput('Width', this.data.width, (val) => {
            this._updateData({ width: val });
        });

        // Height Input
        const heightInput = this._createInput('Height', this.data.height, (val) => {
            this._updateData({ height: val });
        });

        inputContainer.appendChild(widthInput);
        inputContainer.appendChild(heightInput);
        settingsWrapper.appendChild(inputContainer);

        return settingsWrapper;
    }

    wrap(blockContent: HTMLElement) {
        console.log('ImageTune: wrap called for block', this.block);

        // This method wraps the block content
        // We use it to apply styles

        // Apply saved width
        if (this.data.width) {
            console.log('ImageTune: applying width', this.data.width);
            blockContent.style.width = this.data.width;
            blockContent.style.marginLeft = 'auto';
            blockContent.style.marginRight = 'auto';
        }

        // Apply saved height
        if (this.data.height) {
            blockContent.style.height = this.data.height;
            // Ensure image (child) respects this
            const img = blockContent.querySelector('img');
            if (img) {
                img.style.height = '100%';
                img.style.objectFit = 'cover';
            }
        }

        this.wrapper = blockContent;
        return blockContent;
    }

    save() {
        console.log('ImageTune: save called', this.data);
        return {
            width: this.data.width,
            height: this.data.height,
        };
    }

    _createInput(placeholder: string, initialValue: string, onChange: (val: string) => void) {
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.gap = '8px';

        const label = document.createElement('label');
        label.textContent = placeholder;
        label.style.fontSize = '12px';
        label.style.minWidth = '45px';
        label.style.color = '#707684';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'auto';
        input.value = initialValue || '';
        input.style.border = '1px solid #E8E8EB';
        input.style.borderRadius = '4px';
        input.style.padding = '6px';
        input.style.fontSize = '12px';
        input.style.width = '100%';

        input.addEventListener('change', (e) => {
            let val = (e.target as HTMLInputElement).value;
            if (val && !isNaN(Number(val))) {
                val = `${val}px`;
                (e.target as HTMLInputElement).value = val;
            }
            onChange(val);
        });

        wrapper.appendChild(label);
        wrapper.appendChild(input);
        return wrapper;
    }

    _updateData(newData: { width?: string; height?: string }) {
        this.data = { ...this.data, ...newData };

        // Visual update on block
        if (this.block && this.block.holder) {
            const blockContent = this.block.holder.querySelector('.ce-block__content');
            if (blockContent) {
                if (newData.width !== undefined) {
                    blockContent.style.width = newData.width;
                    blockContent.style.marginLeft = 'auto';
                    blockContent.style.marginRight = 'auto';
                }
                if (newData.height !== undefined) {
                    blockContent.style.height = newData.height;
                    // Update img inside
                    const img = blockContent.querySelector('img');
                    if (img) {
                        img.style.height = newData.height ? '100%' : '';
                        img.style.objectFit = newData.height ? 'cover' : '';
                    }
                }
            }
        }
    }
}
