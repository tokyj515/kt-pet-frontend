<template>
  <div class="container">
    <h2>간편결제</h2>
    <BaseButton @click="onPayment" :primary="2">결제하기</BaseButton>
    <BaseButton @click="goBack" >뒤로 가기</BaseButton>
  </div>
</template>
<script setup>
import BaseButton from "@/components/base/BaseButton.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const onPayment = () => {
  /* 1. 가맹점 식별하기 */
  const { IMP } = window;
  IMP.init('imp48126247'); //고객사 식별코드 입력시 실제 결제가됨 -> 나의 코드가 들어가야 함
  /* 2. 결제 데이터 정의하기 */
  const data = {
    pg: 'uplus', // 채널로 등록된 PG사만 사용가능하다. PG사마다 결제 화면이 달라진다 => html5_inicis
    pay_method: 'card', // 결제수단
    merchant_uid: `mid_${new Date().getTime()}`, // 주문번호 -> 이거는 실제 결제할 때 생기는 주문코드같은 거 넣기
    amount: 200, // 결제금액
    name: '결제 테스틑 개발 중', // 주문명 -> 제품명 그런 거
    buyer_name: '홍길동', // 구매자 이름
    buyer_tel: '01012341234', // 구매자 전화번호
    buyer_email: 'baroq8@gmail.com', // 구매자 이메일
    buyer_addr: '신사동 661-16', // 구매자 주소
    buyer_postcode: '06018' // 구매자 우편번호
  };
  /* 4. 결제 창 호출하기 */
  IMP.request_pay(data, callback);
};
const callback = (response) => {
  /* 3. 콜백 함수 정의하기 */
  const {
    success,
    merchant_uid,
    error_msg
  } = response;
  console.log(response);
  //후에 이 정보를 다시 디비에 저장하는 것
  if (success) {
    alert('결제 성공');
  } else {
    alert(`결제 실패: ${error_msg}`);
  }
};

// ✅ 뒤로 가기
const goBack = () => {
  router.push("/");
};

</script>