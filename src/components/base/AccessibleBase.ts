import { BaseComponent } from '../../core/BaseComponent';

export abstract class AccessibleBase extends BaseComponent {
    protected setupA11y(role: string, label: string) {
        this.setAttribute('role', role);
        this.setAttribute('aria-label', label);
        this.setAttribute('tabindex', '0');
    }

    protected handleKeyboardNavigation(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            this.click();
        }
    }
} 