![header](https://capsule-render.vercel.app/api?type=waving&color=auto&height=300&section=header&text=Ansim동행&fontSize=90)

# Ansim동행 프로젝트
## 안심시설물들의 위치를 확인 후 안심 길찾기 및 안심동행을 신청하세요!

![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/8b40f1c1-2887-4f6d-8a36-99acab8a5fce)

### 개발기간 : 2023.12.07 ~ 2024.01.05
### 배포주소 :
### [🖥️시연 영상 👨‍👩‍👧‍👦](https://drive.google.com/file/d/19owUb0n8qzNAa03vPbDJpYwpt_NHgHNZ/view?usp=drive_link)

## 🥩About Ansim동행
**Ansim동행지도는 근처에 있는 안심 시설물들을 찾을 수 있는 서비스입니다.**

### Ansim동행 특징
1. cctv, 비상벨, 안심택배함, 경찰서, 편의점과 같은 안심시설물들의 위치 및 정보 확인
2. 최대 5개의 안심 옵션을 선택하여 최적의 길찾기 제공
3. 커뮤니티를 통한 안심동행 찾기

## 안심길찾기 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/c8152824-852e-496f-b221-ebc851965405)
출발지와 목적지를 입력 후, 최대 5개의 경유지 안심 옵션을 선택가능하여 최적의 길찾기를 제공합니다.
출발지와 목적지 내의 boundary를 계산하여 해당 영역 내 안심객체를 띄우고 선택 가능합니다.

## 안심시설물 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/7b25b2f6-3531-4ca0-b013-8d7d822d71e9)
현재 Map의 영역 내의 CCTV, 가로등 비상벨, 안심택배함, 경찰서, 편의점의 위치가 Marker로 표시되고 가까운 순으로 Card형식 List를 보여줍니다.
Card Click 시 해당 Marker의 위치로 이동 후 InfoWindow로 정보 확인이 가능합니다.
Card 고장신고 Click 시 각 옵션의 위치와 유형 데이터가 포함된 고장신고 작성 Form 생성되며 고장유형과 상세내용 기입 후 제출할 수 있습니다.

## 안심동행 커뮤니티 게시글 목록 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/15d3884c-0612-4e70-88ef-9ae2fb0647e9)
동행 포인트에 따른 뱃지와 모집인원수가 게시글List에 표시됩니다.
Card방식 게시판으로 직관적인 UI가 구현되어있으며 페이지네이션 및 제목 검색기능이 구현되어있습니다.

## 안심동행 커뮤니티 게시글 작성 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/82e43b64-1460-4af1-8d5b-734a78cb29b5)
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/8c4c9338-08d6-406f-8247-ca4bb4b67a75)
글 작성페이지에서 출발지 목적지를 입력 시 게시글에 해당 루트가 표시됩니다.

## 안심동행 커뮤니티 게시글 상세보기 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/15671ed1-020f-4266-8788-d0113f4d747a)
동행 신청버튼을 누르면 작성자에 신청자List가 표시되며, 수락할 경우 작성자와 신청자에게 동행포인트가 +1 부여됩니다.

## 안심동행 시설물 고장신고현황 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/8cd9338d-eb2b-4e2b-a5f5-8c44a9413838)
7일간의 각 옵션 별 고장신고 갯수의 현황을 관리자 권한을 가진 User가 볼 수 있게 구현되어있습니다.

## 안심동행 로그인 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/255e5f2e-71c3-484b-b812-94235675a9c3)
일반 로그인 및 구글, 네이버, 카카오 소셜로그인이 가능합니다.

## 안심동행 마이페이지 화면
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/203c16df-7ada-4d14-9986-81db93141aec)
안심동행 포인트를 확인할 수 있으며, 프로필사진과 mbti 등 정보를 업로드 및 변경할 수 있습니다.

---

### 👨‍👩‍👧‍👦 Team Members
<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://github.com/sszzKim"><img src="https://github.com/yeojuyeong/AnsimReact/assets/115797321/8d31af18-c8cf-43b7-9a76-4147d8aa690d" width="100px;" alt=""/><br /><sub><b>팀장 : 김수지</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/yeojuyeong"><img src="https://github.com/yeojuyeong/AnsimReact/assets/115797321/25c008a0-65a6-459f-af88-267f3555d8f0" width="100px;" alt=""/><br /><sub><b>팀원 : 여주영</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/hiim207"><img src="https://github.com/yeojuyeong/AnsimReact/assets/115797321/44b77798-332d-4ef8-ab17-96f7e5ab4b9a" width="100px;" alt=""/><br /><sub><b>팀원 : 이영진</b></sub></a><br /></td>
      <td align="center"><a href="https://github.com/JongBell"><img src="https://github.com/yeojuyeong/AnsimReact/assets/115797321/f29047f4-bf7d-4d28-a1dd-641bc9dd4526" width="100px;" alt=""/><br /><sub><b>팀원 : 최종현</b></sub></a><br /></td>
    </tr>
  </tbody>
</table>

---

### 👩‍💻 Tech Stack
![image](https://github.com/yeojuyeong/AnsimReact/assets/115797321/2598be93-dbc7-4f8c-93c6-83ae17216c8b)

---

### 📝 Documents

**[화면정의서](https://www.figma.com/file/ncJco24Wt7Dak1EJ8SBWWu/Ansim?type=design&node-id=0-1&mode=design&t=IoPxbIRJdAZz0yM8-0)**<br><br>
**[기능정의서](https://docs.google.com/spreadsheets/d/1w64dT5B8B7yvQfeYibCp4-_nueJtZFvDXKLu6ZiCfmo/edit?usp=sharing)**<br><br>
**[ERD문서](https://www.erdcloud.com/d/pQMSZLRgB3fK6y2gP)**<br><br>








