# excelschedule

Create coloured calendars for class schedules for Microsoft Excel

## How to run

### Frontend

```
brew install npm
npm install
bower install

gem update --system
gem install sass
gem install compass

# to run a test server
grunt server

# to build and test
grunt
```


### Backend

```
./manage.py runserver 8000
```

## Reference

### How to set up the frontend

```
npm install -g yo
npm install -g generator-backbone
yo backbone
grunt
```

### How to set up the backend

```
pip install -r requirements.txt
django-admin.py startproject excelschedule
chmod a+x manage.py
./manage.py runserver 8000
```