import json
import pymysql.cursors

config = {
    'user': 'admin',
    'password': 'password',
    'host': 'lms.cwjvkekjyh6m.us-east-1.rds.amazonaws.com',
    'database': 'lms',
}

connection = pymysql.connect(**config)
cursor = connection.cursor()


def postUserDetails(event, context):

    uid = event["uid"]
    question = event["question"]
    answer = event["answer"]

    try:
        sql1 = "insert into lms.userdetails (uid, question, answer) values (%s, %s, %s)"
        cursor.execute(sql1, (uid, question, answer))
        connection.commit()

        response = {
            "statusCode": 200,
            "body": True,
        }

    except pymysql.InternalError as e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))

        response = {
            "statusCode": 200,
            "body": False,
        }

    return response
