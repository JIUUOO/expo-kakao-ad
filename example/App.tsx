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

        <Group name="이벤트 테스트">
          <Button
            title="회원가입 완료 (sendCompleteRegistrationEvent)"
            onPress={() => {
              ExpoKakaoAd.sendCompleteRegistrationEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="로그인 (sendLoginEvent)"
            onPress={() => {
              ExpoKakaoAd.sendLoginEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="검색 (sendSearchEvent)"
            onPress={() => {
              ExpoKakaoAd.sendSearchEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="콘텐츠 조회 (sendViewContentEvent)"
            onPress={() => {
              ExpoKakaoAd.sendViewContentEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="관심상품 추가 (sendAddToWishListEvent)"
            onPress={() => {
              ExpoKakaoAd.sendAddToWishListEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="장바구니 추가 (sendAddToCartEvent)"
            onPress={() => {
              ExpoKakaoAd.sendAddToCartEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="장바구니 보기 (sendViewCartEvent)"
            onPress={() => {
              ExpoKakaoAd.sendViewCartEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="구매 완료 (sendPurchaseEvent)"
            onPress={() => {
              ExpoKakaoAd.sendPurchaseEvent("구매", 1, 1000, "KRW", [
                {
                  id: "product_1",
                  name: "테스트 상품",
                  quantity: 1,
                  price: 1000,
                },
              ]);
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="인앱 결제 (sendInAppPurchaseEvent) - android only"
            onPress={() => {
              // android only
              if (Platform.OS === "android") {
                ExpoKakaoAd.sendInAppPurchaseEvent("인앱결제", 1, 1000, "KRW", [
                  {
                    id: "product_1",
                    name: "테스트 상품",
                    quantity: 1,
                    price: 1000,
                  },
                ]);
              }
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="잠재고객 (sendParticipationEvent)"
            onPress={() => {
              ExpoKakaoAd.sendParticipationEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="사전준비 (sendPreparationEvent)"
            onPress={() => {
              ExpoKakaoAd.sendPreparationEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="서비스 신청 (sendSignUpEvent)"
            onPress={() => {
              ExpoKakaoAd.sendSignUpEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="튜토리얼 (sendTutorialEvent)"
            onPress={() => {
              ExpoKakaoAd.sendTutorialEvent();
            }}
          />
          <View style={styles.buttonSpacing} />
          <Button
            title="목표달성 (sendMissionCompleteEvent)"
            onPress={() => {
              ExpoKakaoAd.sendMissionCompleteEvent();
            }}
          />
        </Group>
      </ScrollView>
    </SafeAreaView>
  );
}

function Group(props: { name: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupHeader}>{props.name}</Text>
      {props.children}
    </View>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#eee",
  },
  buttonSpacing: {
    height: 10,
  },
};
