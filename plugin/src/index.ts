// External packages
import withBuildProperties from "expo-build-properties";
import {
  ConfigPlugin,
  withInfoPlist,
  withAndroidManifest,
  withStringsXml,
  withProjectBuildGradle,
  withAppBuildGradle,
  AndroidConfig,
  InfoPlist,
} from "expo/config-plugins";

const withKakaoAd: ConfigPlugin<{ trackId: string }> = (
  config,
  { trackId }
) => {
  // android
  config = withStringsXml(config, (config) => {
    const strings = config.modResults;
    strings.resources = strings.resources || { string: [] };
    strings.resources.string = strings.resources.string || [];
    strings.resources.string.push({
      $: { name: "kakao_ad_track_id", translatable: "false" },
      _: trackId,
    });
    return config;
  });

  config = withAndroidManifest(config, (config) => {
    const mainApplication = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults
    );

    AndroidConfig.Manifest.addMetaDataItemToMainApplication(
      mainApplication,
      "com.kakao.ad.tracker.TRACK_ID",
      "@string/kakao_ad_track_id"
    );
    return config;
  });

  config = withProjectBuildGradle(config, (config) => {
    const repoLine = `maven { url 'https://devrepo.kakao.com/nexus/content/groups/public/' }`;
    const contents = config.modResults.contents;
    const pattern = /(allprojects\s*\{\s*repositories\s*\{)/;
    if (pattern.test(contents)) {
      config.modResults.contents = contents.replace(
        pattern,
        `$1\n        ${repoLine}`
      );
    }
    return config;
  });

  config = withAppBuildGradle(config, (cfg) => {
    const contents = cfg.modResults.contents;
    const depBlock = contents.match(/dependencies\s*\{[\s\S]*?\n/);
    if (depBlock) {
      const insert = `
    implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.3.72"
    implementation "com.google.android.gms:play-services-ads-identifier:17.0.0"
    implementation "com.android.installreferrer:installreferrer:1.1.2"
    implementation "com.kakao.ad:tracker:0.3.11"
`;
      cfg.modResults.contents = contents.replace(
        /dependencies\s*\{\n/,
        `dependencies {\n${insert}`
      );
    }
    return cfg;
  });

  config = withBuildProperties(config, {
    android: {
      minSdkVersion: 23,
    },
  });

  // ios
  config = withInfoPlist(config, (config) => {
    const infoPlist = config.modResults as InfoPlist;

    // iOS 9 ATS(App Transport Security)
    const ats = (infoPlist.NSAppTransportSecurity ?? {}) as Record<string, any>;
    ats.NSAllowsArbitraryLoads = true;
    infoPlist.NSAppTransportSecurity = ats;

    // IDFA
    infoPlist.NSUserTrackingUsageDescription =
      "맞춤형 광고 추천을 위해 iOS 기기의 광고식별자를 수집합니다.";

    config.modResults["KAKAO_AD_TRACK_ID"] = trackId;
    return config;
  });

  return config;
};

export default withKakaoAd;
