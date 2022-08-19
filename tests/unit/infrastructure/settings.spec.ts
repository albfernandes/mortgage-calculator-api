import faker from "faker";
import { NonFunctionPropertyNames } from "../../../src/application/contracts/types";
import { Settings } from "../../../src/infrastructure/configurations/settings";

type SettingsType = string | boolean | number | undefined;

const createThrowIfSettingIsUndefined = (
  property: NonFunctionPropertyNames<Settings>,
  settingEnvName: string,
): void => {
  it("Should throw an error when setting is undefined", (): void => {
    // given
    const settings = new Settings({});

    // when
    const getSetting = (): SettingsType => settings[property];

    // then
    expect(getSetting).toThrow(new Error(`Empty setting: ${settingEnvName}`));
  });
};

const createAssertAndReturnNumberSetting = (
  property: NonFunctionPropertyNames<Settings>,
  settingEnvName: string,
): void => {
  describe(property, (): void => {
    createThrowIfSettingIsUndefined(property, settingEnvName);

    it("Should return the number setting when it is defined", (): void => {
      // given
      process.env[settingEnvName] = String(faker.random.number());
      const settings = new Settings(process.env);

      // when
      const setting: SettingsType = settings[property];

      // then
      expect(setting).toEqual(Number(process.env[settingEnvName]));
    });
  });
};

describe("Unit", () => {
  describe("Infrastructure", () => {
    describe("Configurations", () => {
      describe("Settings", () => {
        createAssertAndReturnNumberSetting("apiPort", "PORT");
        createAssertAndReturnNumberSetting("propertyPriceMinimunDownPayment", "PROPERTY_PRICE_MINIMUM_DOWN_PAYMENT");
      });
    });
  });
});
