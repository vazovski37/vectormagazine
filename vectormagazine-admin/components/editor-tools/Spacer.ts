export default class Spacer {
    data: { height: number };
    wrapper: HTMLElement | undefined;

    static get toolbox() {
        return {
            title: 'Spacer',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>'
        };
    }

    constructor({ data }: { data: { height: number } }) {
        this.data = {
            height: data.height || 20,
        };
        this.wrapper = undefined;
    }

    render() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('spacer-tool');
        this.wrapper.style.display = 'flex';
        this.wrapper.style.alignItems = 'center';
        this.wrapper.style.justifyContent = 'center';
        this.wrapper.style.padding = '10px 0';
        this.wrapper.style.position = 'relative';

        // The visual spacer
        const spacerVisual = document.createElement('div');
        spacerVisual.style.width = '100%';
        spacerVisual.style.backgroundColor = 'rgba(0,0,0,0.05)';
        spacerVisual.style.borderRadius = '4px';
        spacerVisual.style.height = `${this.data.height}px`;
        spacerVisual.style.transition = 'height 0.2s';
        spacerVisual.classList.add('spacer-visual');

        // Controls container (only visible on hover/focus, handled by CSS usually, but here specific UI)
        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.alignItems = 'center';
        controls.style.gap = '10px';
        controls.style.position = 'absolute';
        controls.style.right = '0';
        controls.style.top = '-25px';
        controls.style.backgroundColor = '#fff';
        controls.style.border = '1px solid #ddd';
        controls.style.padding = '4px 8px';
        controls.style.borderRadius = '4px';
        controls.style.zIndex = '10';
        controls.style.fontSize = '12px';

        const label = document.createElement('span');
        label.innerText = 'Gap:';

        const input = document.createElement('input');
        input.type = 'range';
        input.min = '10';
        input.max = '200';
        input.value = this.data.height.toString();
        input.style.width = '100px';

        const valueDisplay = document.createElement('span');
        valueDisplay.innerText = `${this.data.height}px`;

        input.addEventListener('input', (e) => {
            const val = parseInt((e.target as HTMLInputElement).value);
            this.data.height = val;
            spacerVisual.style.height = `${val}px`;
            valueDisplay.innerText = `${val}px`;
        });

        controls.appendChild(label);
        controls.appendChild(input);
        controls.appendChild(valueDisplay);

        this.wrapper.appendChild(controls);
        this.wrapper.appendChild(spacerVisual);

        return this.wrapper;
    }

    save(blockContent: HTMLElement) {
        return {
            height: this.data.height,
        };
    }
}
