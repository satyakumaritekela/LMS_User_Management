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


def getUserDetails(event, context):

    uid = event["uid"]
    answer = event["answer"]

    try:
        sql1 = "select * from lms.userdetails where uid = %s"
        cursor.execute(sql1, (uid))
        connection.commit()

        answer_db = cursor.fetchone()[2]

        if (answer == answer_db):
            response = {
                "statusCode": 200,
                "body": "User Autheticated Successfully",
                "headers": {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*'
                },
            }
        else:
            response = {
                "statusCode": 200,
                "body": "Please enter the correct answer",
                "headers": {
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': '*'
                },
            }

    except pymysql.InternalError as e:
        print("Mysql Error %d: %s" % (e.args[0], e.args[1]))

        response = {
            "statusCode": 200,
            "body": "Error",
            "headers": {
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*'
            },
        }

    return response
