package expo.modules.kakaoad

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import com.kakao.ad.tracker.KakaoAdTracker
import com.kakao.ad.common.json.*
import com.kakao.ad.tracker.send
import java.util.Currency
import java.util.Locale

class ExpoKakaoAdModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoKakaoAd")

    /**
     * KakaoAdTracker를 초기화합니다.
     */
    AsyncFunction("activate") { promise: Promise ->
      val ctx = appContext.reactContext?.applicationContext
      if (ctx != null && !KakaoAdTracker.isInitialized) {
        val resId = ctx.resources.getIdentifier(
          "kakao_ad_track_id", "string", ctx.packageName
        )
        if (resId != 0) {
          val trackId = ctx.getString(resId)
          KakaoAdTracker.init(ctx, trackId)
        }
      }
      promise.resolve(null)
    }

    /**
     * 가입완료 이벤트(CompleteRegistration)를 전송합니다.
     */
    Function("sendCompleteRegistrationEvent") { tag: String? ->
      val event = CompleteRegistration().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 로그인 이벤트(Login)를 전송합니다.
     */
    Function("sendLoginEvent") { tag: String? ->
      val event = Login().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 검색 이벤트(Search)를 전송합니다.
     */
    Function("sendSearchEvent") { tag: String?, keyword: String? ->
      val event = Search().apply {
        this.tag = tag ?: ""
        this.search_string = keyword ?: ""
      }
      event.send()
    }

    /**
     * 콘텐츠/상품 조회 이벤트(ViewContent)를 전송합니다.
     */
    Function("sendViewContentEvent") { tag: String?, contentId: String? ->
      val event = ViewContent().apply {
        this.tag = tag ?: ""
        this.content_id = contentId ?: ""
      }
      event.send()
    }

    /**
     * 관심상품 추가 이벤트(AddToWishList)를 전송합니다.
     */
    Function("sendAddToWishListEvent") { tag: String?, contentId: String? ->
      val event = AddToWishList().apply {
        this.tag = tag ?: ""
        this.content_id = contentId ?: ""
      }
      event.send()
    }

    /**
     * 장바구니 추가 이벤트(AddToCart)를 전송합니다.
     */
    Function("sendAddToCartEvent") { tag: String?, contentId: String? ->
      val event = AddToCart().apply {
        this.tag = tag ?: ""
        this.content_id = contentId ?: ""
      }
      event.send()
    }

    /**
     * 장바구니 보기 이벤트(ViewCart)를 전송합니다.
     */
    Function("sendViewCartEvent") { tag: String? ->
      val event = ViewCart().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 구매 이벤트(Purchase)를 전송합니다.
     */
    Function("sendPurchaseEvent") { 
      tag: String?, 
      totalQuantity: Int, 
      totalPrice: Double, 
      currency: String?,
      products: List<Map<String, Any?>>
    ->
      val event = Purchase().apply { this.tag = tag ?: "" }

      event.products = products.map { record ->
        Product().also { product ->
          product.id = (record["id"] as? String) ?: "" // 상품 ID
          product.name = (record["name"] as? String) ?: "" // 상품명
          product.quantity = (record["quantity"] as? Double)?.toInt() ?: 0 // 개수
          product.price = (record["price"] as? Double) ?: 0.0 // 금액
        }
      }
      // currency가 넘겨지지 않으면 기본으로 KRW 사용
      event.currency = if (currency != null) {
        Currency.getInstance(currency)
      } else {
        Currency.getInstance(Locale.KOREA)
      }
      event.total_quantity = totalQuantity
      event.total_price = totalPrice
      event.send()
    }

    /**
     * 인앱 구매 이벤트(InAppPurchase)를 전송합니다.
     */
    Function("sendInAppPurchaseEvent") { 
      tag: String?, 
      totalQuantity: Int, 
      totalPrice: Double, 
      currency: String?,
      products: List<Map<String, Any?>>
    ->
      val event = InAppPurchase().apply { this.tag = tag ?: "" }

      event.products = products.map { record ->
        Product().also { product ->
          product.id = (record["id"] as? String) ?: "" // 상품 ID
          product.name = (record["name"] as? String) ?: "" // 상품명
          product.quantity = (record["quantity"] as? Double)?.toInt() ?: 0 // 개수
          product.price = (record["price"] as? Double) ?: 0.0 // 금액
        }
      }
      event.currency = if (currency != null) {
        Currency.getInstance(currency)
      } else {
        Currency.getInstance(Locale.KOREA)
      }
      event.total_quantity = totalQuantity
      event.total_price = totalPrice
      event.send()
    }

    /**
     * 잠재고객 이벤트(Participation)를 전송합니다.
     *
     * 잠재고객([Participation]) 이벤트는 아래 태그([Participation.tag])를 추가 설정하면 전환을 최적화하는데 도움이 됩니다.
     *
     * 권장 태그 추가 목적 (태그값):
     * - 사전예약 (PreBooking)
     * - 상담신청 (Consulting)
     * - 시승신청 (DrivingTest)
     * - 대출한도조회 (LoanLimitCheck)
     * - 보험료조회 (InsuranceCheck)
     */
    Function("sendParticipationEvent") { tag: String? ->
      val event = Participation().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 사전준비 이벤트(Preparation)를 전송합니다.
     */
    Function("sendPreparationEvent") { tag: String? ->
      val event = Preparation().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 가입 및 등록 이벤트(SignUp)를 전송합니다.
     *
     * 가입 및 등록([SignUp]) 이벤트는 아래 태그([SignUp.tag])를 추가 설정하면 전환을 최적화하는데 도움이 됩니다.
     *
     * 권장 태그 추가 목적 (태그값):
     * - 서비스가입 (SignUp)
     * - 구독완료 (Subscription)
     * - 카드발급 (CardIssuance)
     * - 계좌개설 (OpeningAccount)
     * - 대출신청 (LoanApplication)
     */
    Function("sendSignUpEvent") { tag: String? ->
      val event = SignUp().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 튜토리얼 이벤트(Tutorial)를 전송합니다.
     */
    Function("sendTutorialEvent") { tag: String? ->
      val event = Tutorial().apply { this.tag = tag ?: "" }
      event.send()
    }

    /**
     * 미션완료 이벤트(MissionComplete)를 전송합니다.
     */
    Function("sendMissionCompleteEvent") { tag: String? ->
      val event = MissionComplete().apply { this.tag = tag ?: "" }
      event.send()
    }
  }
}