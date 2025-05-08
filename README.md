# SUSC-WEB-BE

SUSC 폼의 백엔드 레포지토리

## 사전 준비

- Nodejs v22.13.1 ([.nvmrc](.nvmrc))

## 설치

```sh
$ git clone https://github.com/SUSC-KR/SUSC-WEB-BE.git
$ npm install
```

## 개발용 실행

```sh
$ npm instal start:dev
```

## 프로덕션용 실행

```sh
$ npm run build
$ npm run start:prod
```

## HTTP API

현재 모든 HTTP API는 [answer.controller.ts](./src/answer/answer.controller.ts)에 정의되어 있습니다.

### 폼 응답 스키마 관련 사항

따로 스키마 유효성 확인을 하고 있지 않아, 들어오는 그대로 저장하는 방식으로 처리되고 있습니다. 즉, 스키마 정의를 전적으로 클라이언트에 위임하고 있습니다.

현재로서는 스키마 유효성을 확인해야 할만큼 엄밀하게 데이터를 다룰 필요는 없다고 판단하였으며, 추후 스키마 유효성 확인이 필요할만큼 의도와 다른 데이터가 들어오는 경우 구현하는 것으로 결정하였습니다.

### 인증(Authentication)

API의 인증 처리는 `x-api-key` 헤더에 들어온 값이 관련 API KEY와 동일한지만 확인합니다.

크게 "일반 유저용 API"와 "관리자용 API"로 나뉘며, 참조하는 API KEY가 다릅니다.

- "일반 유저용 API"의 API KEY는 `API_KEY` 환경 변수로 설정할 수 있습니다.
- "관리자용 API"의 API KEY는 `MANAGER_TOKEN` 환경 변수로 설정할 수 있습니다.
  - 핸들러 메서드에 `@UseManagerToken()` 데코레이터를 붙이면 관리자용 API로 만들 수 있습니다.

### API 명세

#### `POST /forms/:formId/answers/check-submitted`

주어진 이메일로 해당 폼에 제출한 응답이 존재하는지 확인합니다.

- 파라미터
  - `formId`: 존재 여부를 확인할 폼의 ID
- 요청 바디
  ```typescript
  {
    "email": string; // 존재 여부를 확인할 이메일
  }
  ```
- 응답
  ```typescript
  {
    "isSubmitted": boolean; // 존재하는지 여부
  }
  ```

#### `POST /forms/:formId/answers`

새로운 폼 응답을 제출합니다.

- 파라미터
  - `formId`: 응답을 제출할 폼의 ID
- 요청 바디
  ```typescript
  {
    "email": string; // 제출자의 이메일
    "data": any; // 폼 응답 데이터 (JSON 형식)
  }
  ```
- 응답
  ```typescript
  {
    "id": string; // 생성된 응답의 ID
  }
  ```
- 오류
  - `422 Answer already submitted`: 이미 해당 이메일로 응답이 제출된 경우

#### `POST /forms/:formId/answers/export-to-csv`

폼의 모든 응답을 CSV 파일로 내보냅니다. (관리자용 API)

- 파라미터
  - `formId`: CSV로 내보낼 폼의 ID
- 응답
  - CSV 파일 다운로드 (columns: ID, 이메일, 데이터(JSON), 생성일시)

#### `DELETE /forms/:formId/answers`

특정 이메일의 폼 응답을 삭제합니다. (관리자용 API)

- 파라미터
  - `formId`: 응답을 삭제할 폼의 ID
- 쿼리 파라미터
  - `email`: 삭제할 응답의 이메일
- 응답
  - `204 No Content`: 성공적으로 삭제된 경우
- 오류
  - `404 Answer not found`: 해당하는 응답이 존재하지 않는 경우

## 데이터베이스 마이그레이션

본 프로젝트는 ORM으로 [MikroORM](https://mikro-orm.io/)을 사용하고 있습니다.

로컬 개발 환경에서 DB를 초기화할 필요가 있다면, 아래 명령어를 통해 테이블을 생성할 수 있습니다.

```shell
npm run schema:update
```

그 외 명령어는 MikroORM의 공식 문서를 참고해주세요.

## 환경변수

|      이름       | 설명                            | 필수 |
| :-------------: | :------------------------------ | :--: |
|    `API_KEY`    | 일반 유저용 API 인증을 위한 key |  O   |
| `MANAGER_TOKEN` | 관리자용 API 인증을 위한 key    |  O   |
