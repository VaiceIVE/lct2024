import requests
import bs4
from tqdm import tqdm
import re
import json
from time import sleep
import threading


def parse_data_about_home(link: str):
    html_doc = requests.get(link).text
    soup = bs4.BeautifulSoup(html_doc, 'html.parser')
    t = soup.h1.text
    header = re.sub(r'\s+', ' ', t)
    home_desc = dict()
    for i in soup.find_all('section', {'class': 'required-fields'}):
        info = re.sub(r'\s+', ' ', i.h2.text)
        data = {re.sub(r'\s+', ' ', i1.text): re.sub(r'\s+', ' ', i2.text) for i1, i2 in zip(i.find_all('div', {'class': 'field-label'}), i.find_all('div', {'class': 'field-items'}))}
        home_desc[info] = data
    return {header: home_desc}                


def get_parsed_list_of_home_data(fn: str='list_of_home_data_1'):
    try:
        with open(f'../datasets/links_collections/{fn}.json', 'r') as f:
            list_of_home_data = json.load(f)['list_of_home_data']
    except:
        list_of_home_data = []
    return list_of_home_data


def searching(l_of_homes, list_of_home_data, fn: str='list_of_home_data_1'):
    n = len(list_of_home_data)
    for i in tqdm(l_of_homes[n:]):
        try:
            list_of_home_data.append(parse_data_about_home(i))
        except:
            print(len(list_of_home_data), i)
            sleep(1)
            list_of_home_data.append(parse_data_about_home(i))
        if len(list_of_home_data) % 1000:
            with open(f'../datasets/links_collections/{fn}.json', 'w') as f:
                json.dump({'list_of_home_data': list_of_home_data}, f)
    with open(f'../datasets/links_collections/{fn}.json', 'w') as f:
        json.dump({'list_of_home_data': list_of_home_data}, f)


with open('../datasets/links_collections/list_of_home_links.json', 'r') as f:
    l_of_homes = json.load(f)['l_of_homes']


list_of_home_data_1 = get_parsed_list_of_home_data('list_of_home_data_1')
list_of_home_data_2 = get_parsed_list_of_home_data('list_of_home_data_2')
list_of_home_data_3 = get_parsed_list_of_home_data('list_of_home_data_3')
list_of_home_data_4 = get_parsed_list_of_home_data('list_of_home_data_4')


l = len(l_of_homes) // 5
l_of_homes1 = l_of_homes[:l]
l_of_homes2 = l_of_homes[l:l*2]
l_of_homes3 = l_of_homes[l*2:l*3]
l_of_homes4 = l_of_homes[l*3:l*4]
l_of_homes4 = l_of_homes[l*4:]



t1 = threading.Thread(target=searching, args=(l_of_homes1, list_of_home_data_1, 'list_of_home_data_1'))
t2 = threading.Thread(target=searching, args=(l_of_homes2, list_of_home_data_2, 'list_of_home_data_2'))
t3 = threading.Thread(target=searching, args=(l_of_homes3, list_of_home_data_3, 'list_of_home_data_3'))
t4 = threading.Thread(target=searching, args=(l_of_homes4, list_of_home_data_4, 'list_of_home_data_4'))
t5 = threading.Thread(target=searching, args=(l_of_homes4, list_of_home_data_4, 'list_of_home_data_5'))

t1.start()
t2.start()
t3.start()
t4.start()
t5.start()