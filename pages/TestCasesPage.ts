import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TestCasesPage extends BasePage {
    readonly pageTitle: Locator;
    readonly testCasePanel: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByRole('heading', { name: 'Test Cases', exact: true })
        this.testCasePanel = page.locator('.panel-title');

    }
    async openTestCase(name: string) {
        await this.page.locator(`a[href="#${name}"]`).click();
        await this.page.locator(`.panel-collapse.in`).waitFor({ state: 'visible' });
    }
    async collapseTestCase(name: string) {
        await this.page.locator(`a[href="#${name}"]`).click();
        await expect(this.page.locator(`a[href="#${name}"]`)).not.toHaveClass(/in/);

    }
    async goto() {
        await this.navigate('/test_cases');
        await this.dismissOverlays();
        await expect(this.pageTitle).toBeVisible();
    }
    testCasesSteps(selector: string): Locator {
        return this.page.locator(selector);
    }
}