import { expect } from 'chai';
import { diffArrays } from 'diff';
import * as tableDrawer from '../src/tableDrawer';

describe('table drawer test', () => {
  it('should get colorful string', () => {
    const colorfulString = tableDrawer.colorfulLostKey('AA');

    expect(colorfulString).to.equal('\u001b[31mAA\u001b[39m');
  });


  it('should draw a table', () => {
    const fileNames = ['.env', '.env-example'];
    const baseEnvKeys = ['AA', 'BB'];
    const envKeys = ['AA', 'BB'];

    const payload = {
      fileNames,
      baseEnvKeys,
      envKeys,
      diffs: diffArrays(envKeys, baseEnvKeys),
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
    const fileNames = ['.env', '.env-example'];
    const baseEnvKeys = ['BB', 'CC'];
    const envKeys = ['AA', 'BB'];

    const payload = {
      fileNames,
      baseEnvKeys,
      envKeys,
      diffs: diffArrays(envKeys, baseEnvKeys),
    };

    let expectResult = '';
    expectResult += '╔══════╤══════════════╗\n';
    expectResult += '║ .env │ .env-example ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ \u001b[31mAA\u001b[39m   │ AA           ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ BB   │ BB           ║\n';
    expectResult += '╟──────┼──────────────╢\n';
    expectResult += '║ \u001b[32mCC\u001b[39m   │              ║\n';
    expectResult += '╚══════╧══════════════╝\n';

    expect(expectResult).to.equal(tableDrawer.draw(payload));
  });
});
