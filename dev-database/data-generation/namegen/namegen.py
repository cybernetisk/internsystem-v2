#!/usr/bin/env python
# coding: utf-8

from pyjstat import pyjstat
import pandas as pd
import requests
import json
import random
import importlib.resources

POST_URL_FORNAVN = "https://data.ssb.no/api/v0/no/table/10467"
POST_URL_ETTERNAVN = "https://data.ssb.no/api/v0/no/table/12891/"

cache = {}


def get_data_from_ssb(url, payload):
    response = requests.post(url, json=payload)
    if response.ok:
        dataset = pyjstat.Dataset.read(response.text)
        return dataset.write("dataframe")
    return pd.DataFrame()


def get_fornavn():
    dfs = []
    for kjønn in ["jente", "gutte"]:
        with importlib.resources.open_text('namegen', f"{kjønn}navn.json") as file:
            payload = json.load(file)
        df = get_data_from_ssb(POST_URL_FORNAVN, payload)
        dfs.append(df)
    df = pd.concat(dfs)
    return df.pivot_table(
        index="fornavn", columns="statistikkvariabel", values="value", aggfunc="sum"
    ).reset_index()


def get_etternavn():
    with importlib.resources.open_text('namegen', f"etternavn.json") as file:
        payload = json.load(file)
    df = get_data_from_ssb(POST_URL_ETTERNAVN, payload)
    return df.pivot_table(
        index="etternavn", columns="statistikkvariabel", values="value", aggfunc="sum"
    ).reset_index()


def ensure_initialized(func):
    def wrapper(*args, **kwargs):
        global cache
        if "fornavn" not in cache or "etternavn" not in cache:
            cache["fornavn_df"] = get_fornavn()
            cache["fornavn"] = cache["fornavn_df"]["fornavn"].unique()
            cache["etternavn_df"] = get_etternavn()
            cache["etternavn"] = cache["etternavn_df"]["etternavn"].unique()

        # Call the original function with initialized data
        return func(cache=cache, *args, **kwargs)

    return wrapper


def random_lastname():
    return random_name(cache_key="etternavn")


def random_firstname():
    return random_name(cache_key="fornavn")


def random_fullname(as_list=False, middlename_prob=0.5):
    names = [random_firstname()]
    while random.random() < middlename_prob:
        names.append(random_firstname())
        middlename_prob /= 2
    names.append(random_lastname())
    return names if as_list else " ".join(names)


@ensure_initialized
def random_name(cache_key="fornavn", cache=cache):
    return random.choice(cache[cache_key])


# A username generator, that will store the previously used usernames
def username_generator():
    usernames = []

    def generator(name):
        new_username = generate_username(name, existing_usernames=usernames)
        usernames.append(new_username)
        return new_username

    return generator


def generate_username(name, existing_usernames=[], max_length=8):
    full_name = (
        name.lower()
        .replace("å", "aa")
        .replace("ø", "oe")
        .replace("æ", "ae")
        .replace("-", "")
    )
    names = full_name.split()
    first_name = names[0]
    middle_names = "".join(names[1:-1])
    last_name = names[-1]
    username = first_name[:max_length]

    # Prefer username based on first name
    for i in range(max_length):
        username = f"{username[:(max_length-i)]}{last_name[:i]}"
        if username not in existing_usernames:
            return username

    # Second preference: randomly split username into three parts
    for i in range(100):
        lengths = sorted(random.sample(range(1, max_length), 2 if middle_names else 1))
        cuts = [lengths[0], lengths[-1] - lengths[0], max_length - lengths[-1]]
        username = (
            first_name[: cuts[0]] + middle_names[: cuts[1]] + last_name[: cuts[2]]
        )
        if username not in existing_usernames:
            return username

    # Last resort loop
    i = 2
    while username in existing_usernames:
        digits = len(f"i")
        username = f"{first_name[:max_length-digits]}{i}"
        i += 1

    return username
