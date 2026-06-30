import webuntis
import datetime
today = datetime.date.today()
monday = today - datetime.timedelta(days=today.weekday())
friday = monday + datetime.timedelta(days=4)

s = webuntis.Session(
    server='https://.webuntis.com',
    username='',
    password='',
    school='gymnasium',
    useragent='useragent'
)

print("Initializing session...")
print("Logging in...")
s.login() # see remark below:
print("Logged in!")
# prefered: with webuntis.Session(...).login() as s:

for klasse in s.klassen():

    print(klasse.name)

print("Selecting class 11...")
klasse = s.klassen().filter(name='11')[0]

# get info
table = s.timetable(klasse=klasse, start=monday, end=friday).to_table()

print("Timetable for class 11:")

for i in table[1][1]:
    print(i, end="\n\n\n")


print("Logging out...")
s.logout() # see remark below:
print("Logged out!")