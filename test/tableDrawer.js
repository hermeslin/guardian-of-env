import { expect } from 'chai';
import * as tableDrawer from '../src/tableDrawer';

describe('table drawer test', () => {
  it('should get colorful string', () => {
    const colorfulString = tableDrawer.colorfulLostKey('AA');

    expect(colorfulString).to.equal('\u001b[31mAA\u001b[39m');
  });


  it('should draw a table', () => {
    const payload = {
      fileNames: ['.env', '.env-example'],
      baseEnvKeys: ['AA', 'BB'],
      envKeys: ['AA', 'BB'],
    };

    let expectResult = '';
    expectResult += '╔══════╤══════════════╗\n';
    expectResult += '║ .env │ .env-example ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ AA   │ AA           ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ BB   │ BB           ║\n';
    expectResult += '╚══════╧══════════════╝\n';

    expect(expectResult).to.equal(tableDrawer.draw(payload));
  });

  it('should draw a table with colorful string', () => {
    const payload = {
      fileNames: ['.env', '.env-example'],
      baseEnvKeys: ['BB', 'CC'],
      envKeys: ['AA', 'BB'],
    };

    let expectResult = '';
    expectResult += '╔══════╤══════════════╗\n';
    expectResult += '║ .env │ .env-example ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ BB   │ BB           ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ CC   │ \u001b[31mCC\u001b[39m           ║\n';
    expectResult += '╚══════╧══════════════╝\n';

    expect(expectResult).to.equal(tableDrawer.draw(payload));
  });
});
