# expo-kakao-ad

An Expo module for integrating Kakao Ad SDK into React Native applications to track advertising attribution and conversions.

## Overview

This module provides a simple interface to track user events and conversions for Kakao advertising campaigns. It supports various tracking events commonly used in mobile app analytics and advertising attribution.

## Features

- 🎯 Track user engagement events (login, registration, purchases)
- 📊 Support for conversion tracking with detailed product information
- 🛒 E-commerce events (cart actions, wishlist, purchases)
- 📱 Cross-platform support (iOS and Android)
- 🔧 Easy configuration through Expo config plugins

## Installation

```bash
npm install expo-kakao-ad
```

> **Note**: This module is built with `create-expo-module` and works with both Expo managed projects and bare React Native projects that have Expo modules configured.

## Configuration

Add the plugin configuration to your `app.json` or `app.config.js`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-kakao-ad",
        {
          "trackId": "YOUR_KAKAO_TRACK_ID_HERE"
        }
      ]
    ]
  }
}
```

> **Important**: Replace `YOUR_KAKAO_TRACK_ID_HERE` with your actual Kakao tracking ID provided by Kakao advertising platform.

After adding the plugin, rebuild your app:

```bash
npx expo prebuild --clean
npx expo run:ios
# or
npx expo run:android
```

## Usage

### Basic Setup

```typescript
import ExpoKakaoAd from "expo-kakao-ad";
import { AppState, Platform } from "react-native";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    // Initialize tracking when app starts
    ExpoKakaoAd.activate();

    // Re-activate on iOS when app becomes active
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        Platform.OS === "ios" && ExpoKakaoAd.activate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Your app content
}
```

### Event Tracking

```typescript
// Initialize tracking
await ExpoKakaoAd.activate();

// Track events (in order of API definition)
ExpoKakaoAd.sendCompleteRegistrationEvent("tag");
ExpoKakaoAd.sendLoginEvent("tag");
ExpoKakaoAd.sendSearchEvent("tag", "검색어");
ExpoKakaoAd.sendViewContentEvent("tag", "content_123");
ExpoKakaoAd.sendAddToWishListEvent("tag", "product_456");
ExpoKakaoAd.sendAddToCartEvent("tag", "product_789");
ExpoKakaoAd.sendViewCartEvent("tag");
ExpoKakaoAd.sendPurchaseEvent("tag", 6, 3000, "KRW", [
  {
    id: "id-1",
    name: "ruler",
    quantity: 3,
    price: 1500,
  },
  {
    name: "pencil",
    quantity: 5,
    price: 400,
  },
  {
    name: "eraser",
    quantity: 1,
    price: 1000,
  },
]);

// Android only
if (Platform.OS === "android") {
  ExpoKakaoAd.sendInAppPurchaseEvent("tag", 6, 3000, "KRW", [
    {
      id: "id-1",
      name: "ruler",
      quantity: 3,
      price: 1500,
    },
    {
      id: "id-2",
      name: "pencil",
      quantity: 5,
      price: 400,
    },
  ]);
}

ExpoKakaoAd.sendParticipationEvent("tag");
ExpoKakaoAd.sendPreparationEvent("tag");
ExpoKakaoAd.sendSignUpEvent("tag");
ExpoKakaoAd.sendTutorialEvent("tag");
ExpoKakaoAd.sendMissionCompleteEvent("tag");
```

## API Reference

### Methods

| Method                                                             | Description                         | Platform     |
| ------------------------------------------------------------------ | ----------------------------------- | ------------ |
| `activate()`                                                       | Initialize Kakao ad tracking        | iOS, Android |
| `sendCompleteRegistrationEvent(tag?)`                              | Track registration completion       | iOS, Android |
| `sendLoginEvent(tag?)`                                             | Track user login                    | iOS, Android |
| `sendSearchEvent(tag?, searchString?)`                             | Track search actions                | iOS, Android |
| `sendViewContentEvent(tag?, contentId?)`                           | Track content views                 | iOS, Android |
| `sendAddToWishListEvent(tag?, contentId?)`                         | Track wishlist additions            | iOS, Android |
| `sendAddToCartEvent(tag?, contentId?)`                             | Track cart additions                | iOS, Android |
| `sendViewCartEvent(tag?)`                                          | Track cart views                    | iOS, Android |
| `sendPurchaseEvent(tag, quantity, price, currency, products)`      | Track purchases                     | iOS, Android |
| `sendInAppPurchaseEvent(tag, quantity, price, currency, products)` | Track in-app purchases              | Android only |
| `sendParticipationEvent(tag?)`                                     | Track participation/lead generation | iOS, Android |
| `sendPreparationEvent(tag?)`                                       | Track preparation phase             | iOS, Android |
| `sendSignUpEvent(tag?)`                                            | Track service signup                | iOS, Android |
| `sendTutorialEvent(tag?)`                                          | Track tutorial completion           | iOS, Android |
| `sendMissionCompleteEvent(tag?)`                                   | Track mission/goal completion       | iOS, Android |

### Purchase Event Parameters

Both `sendPurchaseEvent` and `sendInAppPurchaseEvent` accept the same parameters:

- `label` (string): Description of the purchase
- `quantity` (number): Total quantity of items
- `price` (number): Total price of the purchase
- `currency` (string): Currency code (e.g., "KRW", "USD")
- `products` (array): Array of product objects with:
  - `id` (string): Product identifier
  - `name` (string): Product name
  - `quantity` (number): Product quantity
  - `price` (number): Product price

## Complete Example

```typescript
import ExpoKakaoAd from "expo-kakao-ad";
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  AppState,
} from "react-native";
import { useEffect } from "react";

export default function App() {
  useEffect(() => {
    ExpoKakaoAd.activate();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        Platform.OS === "ios" && ExpoKakaoAd.activate();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Kakao Ad Event Test</Text>

        <View style={styles.group}>
          <Text style={styles.groupHeader}>Event Testing</Text>

          <Button
            title="Complete Registration"
            onPress={() => ExpoKakaoAd.sendCompleteRegistrationEvent()}
          />
          <View style={styles.buttonSpacing} />

          <Button
            title="Login"
            onPress={() => ExpoKakaoAd.sendLoginEvent()}
          />
          <View style={styles.buttonSpacing} />

          <Button
            title="Purchase"
            onPress={() => {
              ExpoKakaoAd.sendPurchaseEvent("tag", 6, 3000, "KRW", [
                {
                  id: "id-1",
                  name: "ruler",
                  quantity: 3,
                  price: 1500,
                },
                {
                  id: "id-2",
                  name: "pencil",
                  quantity: 5,
                  price: 400,
                }
              ]);
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: { fontSize: 30, margin: 20 },
  groupHeader: { fontSize: 20, marginBottom: 20 },
  group: { margin: 20, backgroundColor: "#fff", borderRadius: 10, padding: 20 },
  container: { flex: 1, backgroundColor: "#eee" },
  buttonSpacing: { height: 10 },
};
```

### iOS App State Handling

On iOS, you should re-activate tracking when the app becomes active:

```typescript
useEffect(() => {
  const subscription = AppState.addEventListener("change", (nextAppState) => {
    if (nextAppState === "active") {
      Platform.OS === "ios" && ExpoKakaoAd.activate();
    }
  });

  return () => subscription.remove();
}, []);
```

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please refer to the [contributing guide](https://github.com/expo/expo#contributing) for more details.

## License

MIT
