# Chinese Whispers
## How to install
### Backend
> cd backend
> virtualenv env
> source env/bin/activate
> pip install -r requirements.txt

### Frontends
> cd frontend
> cd admin-pannel
> yarn install

Repeat with visualizer and my-app

## How ro run
### backend (dev serv)
First enter virtualenv
> source env/bin/activate
Init database
> flask db init
> flask db migrate
> flask db upgrade
Run:
> python3 app.py

Audio files should be placed in /static and have a unique filename.

### frontends (dev serv)
> yarn start



