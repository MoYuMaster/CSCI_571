import requests, datetime
from dateutil.relativedelta import relativedelta

from datetime import datetime

#2020-03-04
# wdate = datetime.date.today() +  relativedelta(months=-6)
# print(wdate.strftime("%Y-%m-%d"))
# dateT = "9/30/2020"
# price = "100"
# dict = {}
# dict[dateT] = price
# print(dict)

utc = "2020-05-22T17:00:00.000Z"
dt_object1 = datetime.strptime(utc, "%Y-%m-%dT%H:%M:%S.000Z")
dts = str(dt_object1.timestamp()) 
print(dts.replace(".","0") + "0")

# dt_string = "12/11/2018 09:15:32"

# # Considering date is in dd/mm/yyyy format
# dt_object1 = datetime.strptime(dt_string, "%d/%m/%Y %H:%M:%S")
# print("dt_object1 =", dt_object1)