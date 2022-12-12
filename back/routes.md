# ROUTES

### Route: /api/register

POST: {
"username": "pedra",
"email": "pedra@inspedralbes.cat",
"password": "pedra",
"password_confirmation": "pedra"
}

GET: true

---

### Route: /api/login

POST: {
"username": "pedra",
"password": "pedra"
}

GET: {
"login": true,
"token": "8|3IL0WiG6KB8c3pXW7pXK2D3kir0qNpyNKsSOX65r"
}

---

### Route: /api/user-profile

- Token required

POST: 8|3IL0WiG6KB8c3pXW7pXK2D3kir0qNpyNKsSOX65r

GET: {
"userData": {
"id": 2,
"username": "pedra",
"email": "pedra@inspedralbes.cat",
"level": 0,
"created_at": "2022-11-30T08:07:53.000000Z",
"updated_at": "2022-11-30T08:07:53.000000Z"
}
}

---

### Route: /api/users-list

- Token required

POST: 8|3IL0WiG6KB8c3pXW7pXK2D3kir0qNpyNKsSOX65r

GET: {
"usersList": {
"1": "ausias",
"2": "pedra",
"3": "arnau"
}
}

---

### Route: /api/create-game

- Token required

POST: {
"jsonGame": "jsonObject",
"date": "2022-11-30",
"difficulty": "medium",
"category": "all",
"type": "standard"
}

GET: true

---

### Route: /api/create-daily-game

POST:

GET:

---

### Route: /api/get-game

- Token required

POST: {"id": 4}

GET: {
"game": {
"id": 4,
"jsonGame": "[{'category':'Arts & Literature','id':'622a1c397cc59eab6f950ee1','correctAnswer':'George R. R. Martin','incorrectAnswers':['Stephen King','Jack Vance','Edgar Rice Burroughs'],'question':'Which author wrote 'A Song of Ice and Fire'?','tags':['fantasy','literature','arts_and_literature'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Film & TV','id':'625fd683dc0dd3b72da64cf6','correctAnswer':'1977','incorrectAnswers':['1972','1982','1987'],'question':'In which year was Star Wars released?','tags':['film','cult_films','star_wars','film_and_tv'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Food & Drink','id':'622a1c367cc59eab6f9502a5','correctAnswer':'Dutch ','incorrectAnswers':['German','Danish','French'],'question':'What Nationality Is The Lager Giant Grolsch?','tags':['drink','food_and_drink'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Society & Culture','id':'626288214b176d54800e3d8a','correctAnswer':'Live in your world. Play in ours.','incorrectAnswers':['Connecting people','The future is exciting. Ready?','Ideas for Life'],'question':'What is the marketing slogan of PlayStation?','tags':['business','marketing','technology','society_and_culture'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Music','id':'6266bc31b0e62e469cf43e8d','correctAnswer':'Percussion','incorrectAnswers':['Woodwind','Brass','Stringed'],'question':'What type of instrument is a maraca?','tags':['music'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Food & Drink','id':'622a1c367cc59eab6f95024c','correctAnswer':'Vanilla ','incorrectAnswers':['Almond','Cinnamon','Cocoa'],'question':'Which flavouring is added to brandy and egg yolks to make advocaat?','tags':['drinks','food_and_drink'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Arts & Literature','id':'622a1c397cc59eab6f950ea5','correctAnswer':'Alexandre Dumas','incorrectAnswers':['Anatole France','Gustave Flaubert','Charles Perrault'],'question':'Which author wrote 'The Count of Monte Cristo'?','tags':['literature','classic_novels','arts_and_literature'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Science','id':'622a1c3a7cc59eab6f951007','correctAnswer':'Campanulate','incorrectAnswers':['Clochical','Cambarn','Belieux'],'question':'What Word Is Used To Describe Bell Shaped Flowers?','tags':['science'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'History','id':'622a1c3c7cc59eab6f951a39','correctAnswer':'Communist Manifesto','incorrectAnswers':['The American Declaration of Independence','The Gettysberg Address','Magna Carta'],'question':'The last line of which document is 'Working men of all countries, unite.'?','tags':['quotes','literature','history'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'History','id':'622a1c3c7cc59eab6f951aa4','correctAnswer':'Khmer Rouge','incorrectAnswers':['Cambodia Defence League','Forward Phnom','Lek Si'],'question':'Of which Cambodian party was Pol Pot the leader?','tags':['history'],'type':'Multiple Choice','difficulty':'medium','regions':[]}]",
"date": "2022-11-30",
"difficulty": "medium",
"category": "all",
"type": "daily",
"created_at": "2022-11-30T10:48:55.000000Z",
"updated_at": "2022-11-30T10:48:55.000000Z"
}
}

---

### Route: /api/get-daily-game

- Token required

POST:

GET: {
"game": {
"id": 5,
"jsonGame": "[{'category':'Music','id':'622a1c397cc59eab6f950c1b','correctAnswer':'Red Hot Chili Peppers','incorrectAnswers':['The Monkees','Black Flag','Journey'],'question':'Which American rock band released the song 'Under the Bridge'?','tags':['rock_music','music'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Film & TV','id':'622a1c3c7cc59eab6f9517ba','correctAnswer':'Hellraiser','incorrectAnswers':['Evil Dead','Saw','Halloween'],'question':'Which film first featured a character later named Pinhead?','tags':['film','film_and_tv','horror'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Food & Drink','id':'622a1c3b7cc59eab6f9515d2','correctAnswer':'Sauerkraut ','incorrectAnswers':['Currywurst','Pumpernickel','Schnitzel'],'question':'What name is given to a German dish of chopped fermented cabbage?','tags':['germany','food','food_and_drink'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Film & TV','id':'622a1c377cc59eab6f950670','correctAnswer':'Hugo Weaving','incorrectAnswers':['Tobey Maguire','Timothy Spall','Elijah Wood'],'question':'Which actor has featued in films including The Lord of the Rings and Captain America: The First Avenger?','tags':['acting','film','film_and_tv'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'General Knowledge','id':'6239f845a72e7a347ac879db','correctAnswer':'Zulu','incorrectAnswers':['Zebra','Zoological','Zipper'],'question':'What word is used in the NATO Phonetic Alphabet for the letter Z?','tags':['general_knowledge'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Sport & Leisure','id':'622a1c347cc59eab6f94f859','correctAnswer':'Football','incorrectAnswers':['Table tennis','Ice Hockey','Baseball'],'question':'With which sport is Jose Mourinho associated?','tags':['people','sport'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Food & Drink','id':'622a1c367cc59eab6f95027f','correctAnswer':'Spiciness','incorrectAnswers':['Calories','Dairy Content','Alcohol Content'],'question':'What Does The Scoville Scale Measure?','tags':['words','food_and_drink'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Science','id':'6244379e746187c5e7be9364','correctAnswer':'Silicon dioxide','incorrectAnswers':['Potassium hydroxide','Calcium magnesium carbonate','Potassium nitrate'],'question':'What chemical has the formula SiO2?','tags':['science'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'History','id':'622a1c3c7cc59eab6f95187e','correctAnswer':'1789','incorrectAnswers':['1943','1215','1533'],'question':'When Did The Storming Of The Bastille Take Place?','tags':['revolutions','france','history'],'type':'Multiple Choice','difficulty':'medium','regions':[]},{'category':'Geography','id':'622a1c387cc59eab6f950a9d','correctAnswer':'Germany','incorrectAnswers':['Hungary','Austria','Slovenia'],'question':'Which of these countries borders Poland?','tags':['europe','geography'],'type':'Multiple Choice','difficulty':'medium','regions':[]}]",
"date": "2022-11-30",
"difficulty": "medium",
"category": "all",
"type": "daily",
"created_at": "2022-11-30T10:54:41.000000Z",
"updated_at": "2022-11-30T10:54:41.000000Z"
}
}

---

### Route: /api/create-score

- Token required

POST: {
"idGame": 4
}

GET: true

---

### Route: /api/update-score

- Token required

POST: {
"idGame": 4,
"points": 90,
"time": 170
}

GET: true

---
