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
