import sys
import os
import psycopg2
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
xaxis=sys.argv[1]
yaxis=sys.argv[2]


def to_image(li):
    #list of tuples format say group by dept select age [('IT',19),('cse',18)]
    #xaxis= dept,name
    #yaxis=age

    data2 = [list(ele) for ele in li] #list of tuples made to list of list rows- [["IT",19],["cse",18]]
    #axis y supposed to be [19,18,...] axis x supposed to be ["IT","CSE"]...
    #
    axisx=[e[0] for e in data2]
    axisy=[e[1] for e in data2]
    plt.bar( axisx,axisy, color ='maroon',
        width = 0.4)

    plt.xlabel(xaxis)
    plt.ylabel(yaxis)
    plt.title("Students enrolled in different courses")
    if os.path.exists("./abc.png"):
        os.remove("abc.png")
    plt.savefig('abc.png', bbox_inches='tight')
    print("data")
    sys.stdout.flush()





def postgres():

    query="select "+xaxis+","+yaxis+" from public.some "+"group by "+xaxis
    conn=psycopg2.connect(host="localhost",dbname="postgres",user="postgres",password="Navin@2002",port="5432")
    cur=conn.cursor()
    cur.execute(query)
    to_image(cur.fetchall())
    conn.commit()
    cur.close()
    conn.close()

postgres()

"""
sys.stdout.flush()

os._exit(os.EX_OK)
"""