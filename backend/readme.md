# Chinese Whispers
## How to install
### Backend
```bash
> cd backend
> virtualenv env
> source env/bin/activate
> pip install -r requirements.txt
```

### Frontends
```bash
> cd frontend
> cd admin-pannel
> yarn install
```

Repeat with visualizer and my-app

## How ro run
### backend (dev serv)
First enter virtualenv
```bash
> source env/bin/activate
```
Init database
```bash
> flask db init
> flask db migrate
> flask db upgrade
```
Run:
```bash
> python3 app.py
```
Audio files should be placed in /static and have a unique filename.

### frontends (dev serv)
```bash
> yarn start
```


