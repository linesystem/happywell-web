# happywell-web

## 신규설치
리눅스 설치
git client 설치
```
$ sudo apt-get install git
```
source download
```
$ git clone https://github.com/nerdyfactory/happywell-web.git
```
install script 실행
```
$ cd happywell-web
$ ./scripts/install.sh
```

## version update
update script 실행
```
$ cd happywell-web
$ ./scripts/upgrade.sh
```

## 프로세스 관련 명령어
프로세스 재기동
```
$ npm restart
```
프로세스 정지
```
$ npm stop
```
프로세스 시작
```
$ npm start
```
프로세스 상태
```
$ npm run show
```
프로세스 모니터링
```
$ npm run monit
```

## 디렉토리 구조
### server
- `server/api`: http API서버 관련 모듈
- `server/comm`: 시리얼 통신관련 모듈
- `server/app.js`: API서버 메인파일
- `server/constants.js`: 각종상수 정의
- `server/storage.js`: json데이터 핸들링 모듈(DB)

### client
- `client/index.js`: client view 메인파일 
- `client/log.js`: log view 메인파일 
- `client/routes.js`: path별 view지정
- `client/store.js`: client data store 설정
- `client/constants.js`: 각종상수정의
- `client/auth.js`: 로그인
- `client/actions`: 이벤트 정의
- `client/reducers`: 이벤트별 데이터 핸들링 정의
- `client/containers`: main view정의
- `client/components`: sub view정의

### dist
컴파일된 파일들이 위치하는 디렉토리, static 파일(이미지, css파일)

### scripts
설치 업그레이드관련 스크립트파일
