import { test, expect } from '../../fixtures/index';

test.describe('Test Cases Page', () => {
    //TC07 Verify Test Cases Page
    test('should load test cases page', async ({ homePage, testCasesPage }) => {
        await homePage.goto();
        await homePage.navTestCases.click();
        await expect(testCasesPage.pageTitle).toBeVisible();
        await testCasesPage.expectURL('/test_cases');
    })
    //extra tests
    test('should open test case', async ({ testCasesPage }) => {
        await testCasesPage.goto();
        await testCasesPage.expectURL('/test_cases');
        await testCasesPage.openTestCase('collapse7');
    })
    test('should show test case steps', async ({ testCasesPage }) => {
        await testCasesPage.goto();
        await testCasesPage.expectURL('/test_cases');
        await testCasesPage.openTestCase('collapse7');
        const listItems = testCasesPage.testCasesSteps('#collapse7 .list-group-item');
        await expect(listItems).toHaveCount(5); // TC7 has 5 steps
        await expect(listItems.first()).toContainText('Launch browser');
        await expect(listItems.last()).toContainText('navigated to test cases page successfully');
    })
    test('should collapse test case', async ({ testCasesPage }) => {
        await testCasesPage.goto();
        await testCasesPage.expectURL('/test_cases');
        await testCasesPage.openTestCase('collapse7');
        await testCasesPage.collapseTestCase('collapse7');

    })
})