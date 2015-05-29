// transpile:mocha

import { Emulator } from '../lib/android-tools';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import 'mochawait';

chai.should();
chai.use(chaiAsPromised);

describe('android tools', function () {
  this.timeout(300000);
  before(async () => {
  });

  it('launch emu',async () => {
    let emu;
    try {
      emu = new Emulator('NEXUS_S_18_X86');
      emu.start();
      await emu.waitTillReady();
    } finally {
      if (emu) emu.stop();
    }
  });

  after(async () => {
  });

});

