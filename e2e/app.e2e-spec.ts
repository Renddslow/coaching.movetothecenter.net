import { CoachingPage } from './app.po';

describe('coaching App', () => {
  let page: CoachingPage;

  beforeEach(() => {
    page = new CoachingPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
