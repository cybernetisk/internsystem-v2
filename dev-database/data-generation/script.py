#!/usr/bin/env python
# coding: utf-8

import pandas as pd
import argparse
import sys
from namegen import random_fullname, username_generator

# Parse command-line arguments
parser = argparse.ArgumentParser(description="Transform a CSV file with user data.")
parser.add_argument("input_csv", help="Input CSV file")
args = parser.parse_args()

# Load the input CSV file
df = pd.read_csv(args.input_csv)

# Generate usernames
usergen = username_generator()

# Modify the DataFrame
for i, row in df.iterrows():
    names = random_fullname(as_list=True)
    df.at[i, 'firstName'] = ' '.join(names[0:-1])
    df.at[i, 'lastName'] = names[-1]
    df.at[i, 'email'] = f"{usergen(' '.join(names))}@testdummy.cyb.no"

# Output the modified CSV to stdout
df.to_csv(sys.stdout, index=False, na_rep='NULL')
