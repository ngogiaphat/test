# v13-discord-bot-template

### Create DB:
1. Create database in mongo with name as <DB_NAME> in env
2. Create userAdmin:
```
db.createUser({
	user: <DB_USER>,
	pwd: <DB_PASSWORD>,
	roles:[
        {role: "userAdmin" , db: <DB_NAME>}
    ]
})
```
3. Follow connect status in debug log.