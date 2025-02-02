# Carrot Market (Learn Next.js)

### 1. tailwind

- flex justify

  > ✔ 양 끝에도 여백이 필요한 경우 justify-around
  > ✔ 양 끝을 부모 컨테이너에 딱 붙이고 싶으면 justify-between

- 굳이 flex-col 쓰는 이유는?

  > ✔ 블록 요소끼리는 기본적으로 세로로 정렬되지만,
  > ✔ flex flex-col을 사용하면 align-items, gap, justify-content, order 등을 활용할 수 있어서 더 유연한 레이아웃을 만들 수 있음.

- tailwind의 변수 설정 클래스

  > 예를 들어, ring class의 경우엔 다양한 variable을 추가 선언 가능하다.

  ```css
  .ring {
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(
        --tw-ring-offset-width
      )
      var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(
        3px + var(--tw-ring-offset-width)
      )
      var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0
          0 #0000);
  }
  ```

  ```jsx
  <div classname="ring ring-shadow ring-offset-2 ring-blue-500"></div>
  ```

- required input를 invalid 가상 클래스를 통해 스타일 제어가 가능함.

  ```jsx
  <input
    className="ring ring-transparent focus:ring-green-500 focus:ring-offset-2  invalid:focus:ring-red-500 peer"
    type="email"
    placeholder="Email Address"
    required
  />

  // 유효한 입력값이 아닐 때, input focus하면 ring color 붉은색으로 보임
  ```

- 형제 상태에 따른 스타일 지정(peer-{modifier})

  형제 요소의 상태에 따라 요소의 스타일을 지정해야 하는 경우 형제를 peer 클래스로 표시하고 peer-invalid와 같은 peer-\* 수정자를 사용하여 대상 요소의 스타일을 지정.

  > ⚠️ 주의!
  > peer 마커는 이전 형제에서만 사용할 수 있다는 점을 유의

  ```
    // 작동XXX. 이전 형제 자매만 peer로 표시될 수 있음.
    // input이 span보다 앞에 있어야 함
    < label >
    < span class="peer-invalid:text-red-500 ..." >Email< /span >
    < input type="email" class="peer ..."/ >
    < /label >
  ```

  - [tailwind peer](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)

- \*:

  > 모든 자식요소에 공통 적용할 클래스

- has-[]:

  > 자식의 요소중 [:상태, .class] 인 경우에 부모에 적용할 클래스
  > ⚠️주의
  > has-[#keyOfChild]는 적용되지 않음
  > has-[input[data-key='email']] 와 같이 사용 권장

  ```jsx
    <div className="*:outline-none ring ring-transparent transition-shadow has-[:invalid]:ring-red-200">
      <!-- children.. -->
    </div>

    // 자식 요소중 invaild한 값을 가진 것이 있다면 div 의 ring color 붉은 색으로 변경됨
  ```

### 2. Server Action

- **Route Handler (API Route)**
  - Route Handlers를 사용하면 웹 요청 및 응답 API를 사용하여 특정 경로에 대한 사용자 커스텀 요청 핸들러를 생성할 수 있다.
  - Route Handlers는 app 디렉터리 내에서만 사용할 수 있다.
    > app/api(www)/[users]/route.ts
  - 다만, `Server Action`을 사용하면 굳이 사용할 필요가 없다. 통신을 위해 JS를 사용해야하기 때문이다.
  - [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
  - [Route.ts](https://nextjs.org/docs/app/api-reference/file-conventions/route)
