import { mergeTests } from '@playwright/test';
import { test as uiTest } from './ui.fixtures';
import { test as apiTest } from './api.fixtures';

export const test = mergeTests(uiTest, apiTest);
export { expect } from '@playwright/test';