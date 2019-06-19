const puppeteer = require('puppeteer');

const REDDIT_URL = `https://old.reddit.com/chat/channel/create`;

const self = {
  browser:null,
  pages:null,
  dms:null,

  initialize: async()=>{
    self.browser = await puppeteer.launch({
      headless: true
    });
    self.page = await self.browser.newPage();
      
  },

  login: async(username,password)=>{
    
    await self.page.goto(REDDIT_URL, {waitUntil: 'networkidle0'});
    await self.page.type('input[name="username"]',username,{delay:30});
    await self.page.type('input[name="password"]',password,{delay:30});
    await Promise.all([
      await self.page.click('body > div > div > div.PageColumn.PageColumn__right > div > form > fieldset:nth-child(10) > button'),
      await self.page.waitForNavigation({waitUntil:'networkidle0'})
    ])
    self.page.close();
    
  },

  sendDM: async(user,verificationCode)=>{
    self.dms = await self.browser.newPage();
    await self.dms.goto(REDDIT_URL, {waitUntil: 'networkidle0'});
    await self.dms.click('#tooltip-container > div.e23vrj-0.dUPBYp > div > div.e23vrj-2.eNvqpr > button.e23vrj-3.eOsmRS');
    await self.dms.click('#tooltip-container > div.e23vrj-0.dUPBYp > span > span');

    let selector = '#tooltip-container > form > div > div.s1o4sve7-0.fmHcfL > div.s5fdb09-0.lgmODm.s3r1bgt-0.hkgovY > span.s5fdb09-2.dtIgCr > input';

    await self.dms.type(selector,user,{delay:30});
    await self.dms.waitFor(5000);
    try{
      await self.dms.click('#tooltip-container > form > div > div.s1o4sve7-0.fmHcfL > div.s1o4sve7-2.hzkbIJ.s3r1bgt-0.hkgovY > div.s1o4sve7-3.ireWCY > label > span > span.x0psgc-4.ictMnq')
    }catch{
      return false
    }
    await Promise.all([
      self.dms.click('#tooltip-container > form > div > div.s810vm8-1.kNwbdb > button.s810vm8-0.kuXFtN'),
      self.dms.waitForNavigation({waitUntil:'networkidle0'})
    ]);
    
    selector = '#MessageInputTooltip--Container > textarea';
    await self.dms.type(selector,verificationCode,{delay:30});
    await self.dms.click('#MessageInputTooltip--Container > div > button > svg > path');
    

  }
}

module.exports = self;
