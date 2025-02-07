# Carrot Market (Learn Next.js)

### 1. tailwind

- **flex justify**

  ✔ 양 끝에도 여백이 필요한 경우 justify-around

  ✔ 양 끝을 부모 컨테이너에 딱 붙이고 싶으면 justify-between

- **굳이 flex-col 쓰는 이유는?**

  ✔ 블록 요소끼리는 기본적으로 세로로 정렬되지만, flex flex-col을 사용하면 align-items, justify-content, order 등을 활용할 수 있어서 더 유연한 레이아웃을 만들 수 있음.

- **tailwind의 변수 설정 클래스**

  예를 들어, ring class의 경우엔 다양한 variable을 추가 선언 가능하다.

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

- **required input를 invalid 가상 클래스를 통해 스타일 제어**

  ```jsx
  // 유효한 입력값이 아닐 때, input focus하면 ring color 붉은색으로 보임
  <input
    className="ring ring-transparent focus:ring-green-500 focus:ring-offset-2  invalid:focus:ring-red-500 peer"
    type="email"
    placeholder="Email Address"
    required
  />
  ```

- **형제 상태에 따른 스타일 지정 (peer-{modifier})**

  형제 요소의 상태에 따라 요소의 스타일을 지정해야 하는 경우 형제를 peer 클래스로 표시하고 peer-invalid와 같은 peer-\* 수정자를 사용하여 대상 요소의 스타일을 지정.

  > ⚠️ 주의!
  > peer 마커는 이전 형제에서만 사용할 수 있다는 점을 유의
  >
  > [tailwind peer](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-sibling-state)

  ```jsx
  // 작동XXX. 이전 형제 자매만 peer로 표시될 수 있음.
  // input이 span보다 앞에 있어야 함
  <label>
    <span class="peer-invalid:text-red-500 ...">Email</span>
    <input type="email" class="peer ..." />
  </label>
  ```

- **\*: (자식 선택)**

  모든 자식요소에 공통 적용할 클래스

- **has-[]**:

  자식의 요소중 [:상태, .class] 인 경우에 부모에 적용할 클래스

  > ⚠️주의
  > has-[#keyOfChild]는 적용되지 않음
  > has-[input[data-key='email']] 와 같이 사용 권장

  ```jsx
    // 자식 요소중 invaild한 값을 가진 것이 있다면 div 의 ring color 붉은 색으로 변경됨
    <div className="*:outline-none ring ring-transparent transition-shadow has-[:invalid]:ring-red-200">
      <!-- children.. -->
    </div>
  ```

### 2. Server Action

- **Route Handler (API Route)**

  ✔ Route Handlers를 사용하면 웹 요청 및 응답 API를 사용하여 특정 경로에 대한 사용자 커스텀 요청 핸들러를 생성할 수 있다.

  ✔ Route Handlers는 app 디렉터리 내에서만 사용할 수 있다.

  > app/api(www)/[users]/route.ts

  ✔ 다만, `Server Action`을 사용하면 굳이 사용할 필요가 없다. 통신을 위해 JS를 사용해야하기 때문이다.

  ✔ 공식 문서

  - [Route Handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
  - [Route.ts](https://nextjs.org/docs/app/api-reference/file-conventions/route)

- **useServerStatus**

  ✔ 부모 form action의 진행(pending)을 알기 위해 사용

  ✔ 프로젝트에서는 submit 버튼의 연속 클릭 방지를 위해 사용

  ✔ form의 자식인 client 컴포넌트에서만 사용 가능 (form이 작성된 컴포넌트에서는 사용 불가)

  ```jsx
  const { pending } = useFormStatus();
  ```

- **useActionState**

  ✔ form action의 결과를 알기 위해 사용

  ```jsx
  // state -> form이 반환한 값, action의 실행 결과값이 된다.
  // trigger(dispatch, action) -> form의 action 실행 함수
  const [state, action] = useActionState(
    handleForm, // form 핸들러 함수
    null // state의 초기값 설정
  );
  ```

  > **useActionState의 실행 순서**
  >
  > 1. 초기값(state) handleForm으로 전송
  > 2. action 트리거 (form 제출)
  > 3. 초기값 state, action 결과값으로 갱신

### 3. Prisma

> Prisma는 Node.js와 TypeScript에서 사용되는 ORM(Object-Relational Mapping) 도구.
>
> 데이터베이스와 애플리케이션 간의 상호작용을 쉽게 해주는 강력한 도구로, SQL 쿼리를 TypeScript 코드로 대체 가능

- **사용 방법**

  ```zsh
    npm i prisma
  ```

  > prisma 설치

  ```zsh
    npx prisma init
  ```

  > schema.prisma 파일 생성

- **prisma model**

  ```prisma
    // model -> db에 든 객체
    // model schema 정의
    model User {
      // @default(autoincrement()) -> 사용자 id 자동으로 증가시키기
      // 최초 사용자 id = 1
      id         Int       @id @default(autoincrement())
      username   String    @unique
      // 전화번호, 소셜 로그인 한 유저의 경우에는 email, pw가 정의되지 않을 수 있으므로 ? 사용
      email      String?   @unique
      password   String?
      phone      String?   @unique
      github_id  String?   @unique
      avatar     String?
      // now() -> 사용자가 생성되는 시간 반환 함수
      created_at DateTime? @default(now())
      // 사용자 레코드가 수정된 시간을 속성에 넣기
      updated_at DateTime? @updatedAt
    }
  ```

- **migration**

  ```zsh
  npx prisma migrate dev
  ```

  > -> 생성된 마이그레이션 파일을 데이터베이스에 적용 (migration.sql 파일에 작성한 model에 관한 sql문 생성)
  >
  > -> npx prisma create 명령어도 함께 실행. 이 명령어로 Client 생성
  >
  > Generated Prisma Client (v6.3.1) to ./node_modules/@prisma/client

- **Prisma Studio**

  ```zsh
    npx prisma studio
  ```

  > localhost:5555로 열림. 데이터베이스 시각화

- **@relation**

  > 관계된 두 모델 연결시키기

  ```prisma
    model User{
      // ...다른 필드값
      SMSToken   SMSToken[]
    }

    model SMSToken {
      id         Int       @id @default(autoincrement())
      token      String    @unique
      created_at DateTime? @default(now())
      updated_at DateTime? @updatedAt
      // 아래 줄을 기입하는 이유는
      // prisma에게 userId가 가지는 의미(사용자 아이디) userId를 어디서 찾아야하는지 이런걸 명시적으로 알려주기 위해서
      // SMSToken의 userId 필드는 User model의 id 필드를 참조한다는 의미
      user       User      @relation(fields: [userId], references: [id])
      userId     Int
      // 실제로 저장되는 값은 userId
      // userId를 바탕으로 User정보를 찾는것
    }
  ```

  ```ts
  async function test() {
    const token = await db.sMSToken.findUnique({
      where: {
        id: 1,
      },
      // smsToken와 관계된(relation) user data 불러오기
      include: {
        user: true,
      },
    });
    console.log(token);
  }
  ```

- **onDelete**

  > Referential actions는 관련된 레코드가 삭제되거나 업데이트될 때 어떤 일이 발생하는지를 결정.

  > Prisma는 아래의 referential actions 종류를 지원함

  - Cascade: 참조 레코드를 삭제하면 참조 레코드의 삭제가 트리거.
  - Restrict: 참조 레코드가 있는 경우 삭제를 방지.
  - NoAction: Restrict과 유사하지만 사용 중인 데이터베이스에 따라 다름.
  - SetNull: 참조 필드가 NULL로 설정. (optional일 때만 정상 작동)
  - SetDefault: 참조 필드가 기본값으로 설정.

- **iron-session**

  > iron-session은 안전하고, statelss한, 쿠키 기반 JavaScript용 세션 라이브러리.

  ```zsh
  npm i iron-session
  ```

- **Cookie vs Session**

  - Cookie - Web Browser (Client에서 사용)
  - Session - Server에서 사용
  - 단 쿠키안에 세션 ID가 있고 서버에 세션ID 안에 세션 존재.
  - 작동 방식
    > 1. 브라우저가 서버 접속
    >
    > 2. 서버에서 쿠키안에 세션ID를 브라우저에 전달
    >
    > 3. 브라우저가 쿠키안에 세션ID와 페이지 데이터를 서버에 전달
    >
    > 4. 서버에서 세션ID를 검색하고 페이지에 맞는 데이터 전달.

- **zod superRefine**

  > fatal한 에러 발생시 뒤의 validation을 실행하지 않고 얼리리턴

  ```tsx
    .superRefine(async ({ username }, ctx) => {
      const user = await db.user.findUnique({
        where: { username },
        select: { id: true },
      });
      if (user) {
        ctx.addIssue({
          code: "custom",
          message: "이미 사용중인 이름입니다.",
          path: ["username"],
          fatal: true,
        });

        return z.NEVER;
      }
    })
  ```

- **Iron-Session vs session DB**
  | **기준** | **IronSession (HttpOnly 쿠키)** | **Session DB (Redis, SQL)** |
  |--------------------------|----------------------------------------------|--------------------------------------------|
  | **설정 및 구현** | 간단하고 설정이 쉬움 | 복잡한 설정 필요 (DB 구축) |
  | **데이터 크기 제한** | 약 4KB 제한 | 제한 없음 |
  | **보안** | 암호화된 쿠키, HTTPS 필요, 쿠키 하이재킹에 취약 | 서버 관리, 세션 만료 관리 용이, 데이터베이스 보안 설정 필요 |
  | **응답 속도** | 빠름 (Stateless) | 다소 느릴 수 있음 (DB 액세스 필요) |
  | **서버 확장성** | 서버 확장에 유리 | 서버 확장 시 관리 복잡성 증가 |
  | **장기 세션 관리** | 부적합 (단기 세션에 적합) | 적합 (장기 상태 유지 가능) |
  | **복잡한 사용자 상태 관리** | 어려움 | 용이 |
