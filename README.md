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
chmod a+x manage.py
./manage.py syncdb
yes yes | ./manage.py collectstatic
./manage.py runserver 8000
```