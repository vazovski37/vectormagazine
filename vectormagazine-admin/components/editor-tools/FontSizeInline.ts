export default class FontSizeInline {
    private select: HTMLSelectElement | null = null;
    private wrapper: HTMLDivElement | null = null;
    private selectedRange: Range | null = null;
    private currentSize = 16;
    private readonly sizeOptions = [12, 14, 16, 18, 20, 24, 32, 40, 48, 56, 64, 72];

    static get isInline() {
        return true;
    }

    static get title() {
        return 'Font Size';
    }

    static get sanitize() {
        return {
            span: {
                style: true,
                class: true,
            },
            font: {
                class: true,
                color: true,
                face: true,
                size: true,
                style: true,
            },
        };
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'vm-font-size';

        const select = document.createElement('select');
        select.className = 'ce-inline-tool vm-font-size__select';
        select.title = 'Font size';

        this.sizeOptions.forEach((size) => {
            const nativeOption = document.createElement('option');
            nativeOption.value = String(size);
            nativeOption.textContent = `${size}px`;
            select.appendChild(nativeOption);
        });
        select.value = String(this.currentSize);

        select.addEventListener('pointerdown', () => {
            this.captureSelection();
        });

        select.addEventListener('focus', () => {
            this.captureSelection();
        });

        select.addEventListener('change', () => {
            const size = Number(select.value);
            if (!Number.isFinite(size)) {
                return;
            }

            this.currentSize = size;
            this.applyFontSizeToSavedSelection(size);
        });

        wrapper.appendChild(select);

        this.wrapper = wrapper;
        this.select = select;

        return wrapper;
    }

    surround() {
        // Intentionally no-op. We apply style when size is chosen from dropdown.
    }

    checkState() {
        return false;
    }

    clear() {
        this.select = null;
    }

    private captureSelection() {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;
        this.selectedRange = selection.getRangeAt(0).cloneRange();
    }

    private restoreSelection(): boolean {
        if (!this.selectedRange) return false;
        const selection = window.getSelection();
        if (!selection) return false;
        selection.removeAllRanges();
        selection.addRange(this.selectedRange);
        return true;
    }

    private applyFontSizeToSavedSelection(size: number) {
        const restored = this.restoreSelection();
        if (!restored || !this.selectedRange || this.selectedRange.collapsed) {
            return;
        }

        const selection = window.getSelection();
        if (!selection) return;

        // Reliable path for contenteditable selections in EditorJS.
        const commandLevel = this.toExecCommandLevel(size);
        const rangeBeforeApply = selection.rangeCount > 0
            ? selection.getRangeAt(0).cloneRange()
            : this.selectedRange.cloneRange();

        document.execCommand('fontSize', false, commandLevel);

        // Convert deprecated <font size="x"> tags to semantic inline style,
        // scoped to affected nodes only.
        const root = this.findEditorRoot(selection.anchorNode || rangeBeforeApply.commonAncestorContainer);
        if (root) {
            root.querySelectorAll(`font[size="${commandLevel}"]`).forEach((fontTag) => {
                const element = fontTag as HTMLElement;
                if (!rangeBeforeApply.intersectsNode(element)) {
                    return;
                }
                const span = document.createElement('span');
                span.style.fontSize = `${size}px`;
                while (element.firstChild) {
                    span.appendChild(element.firstChild);
                }
                element.replaceWith(span);
            });
        }

        // Keep selection for consecutive edits.
        this.captureSelection();
    }

    private toExecCommandLevel(size: number): string {
        if (size <= 10) return '1';
        if (size <= 13) return '2';
        if (size <= 16) return '3';
        if (size <= 18) return '4';
        if (size <= 24) return '5';
        if (size <= 32) return '6';
        return '7';
    }

    private findEditorRoot(node: Node | null): HTMLElement | null {
        if (!node) return null;
        let current: Node | null = node;
        while (current) {
            if (current instanceof HTMLElement && current.classList.contains('codex-editor')) {
                return current;
            }
            current = current.parentNode;
        }
        return null;
    }

}
