import json
from datetime import timedelta, datetime
from datetime import date as datevalue

with open('base.json', 'r') as file:
    people = json.load(file)

with open('flights.json', 'r') as file:
    flights = json.load(file)

fulldates = []
initiallocs = []

# Relate locations to individuals

for individual in people:
    locations = [("2025-01-01", individual["initiallocation"])]

    for flight in flights:
        if individual["individual"] == flight["individual"]:
            locations.append((flight["date"], flight["to"]))

    individual["locations"] = locations

    initiallocs.append([individual["individual"], individual["initiallocation"]])
    
fulldates.append({"date": "2025-01-01", "locations": initiallocs})

# Generate locations of everyone on all day from 01-01-2025 to 31-12-2025, store as list

def daterange(start, end):
  return [start + timedelta(n) for n in range(int((end - start).days))]

dates = daterange(datevalue(2025, 1, 2), datevalue(2025, 12, 31))

# Having every date stored with each individual's location on that date

for date in dates:
    currentlocations = []
    for individual in people:
        notfoundloc = True
        prev_location = None
        previous_date = datetime.strptime(str(date), "%Y-%m-%d") - timedelta(days=1)

        for location in sorted(individual["locations"], key=lambda x: datetime.strptime(x[0], "%Y-%m-%d")):
            loc_date = datetime.strptime(location[0], "%Y-%m-%d")
            if loc_date <= previous_date:
                prev_location = location[1]
            else:
                break

        while notfoundloc:
            for location in individual["locations"]:
                loc_date = datetime.strptime(location[0], "%Y-%m-%d")
                curr_date = datetime.strptime(str(date), "%Y-%m-%d")

                if curr_date > loc_date:
                    currentlocations.append((individual["individual"], location[1]))
                    notfoundloc = False
                elif curr_date == loc_date:
                    currentlocations.append((individual["individual"], (prev_location, location[1])))
                    notfoundloc = False

    # a very lazy fix
    seen = set()
    result = []

    for name, city in reversed(currentlocations):
        if name not in seen:
            seen.add(name)
            result.append((name, city))

    result.reverse()

    fulldates.append({
        "date": str(date),
        "locations": result
    })

with open('data.json', 'w') as f:
    json.dump(fulldates, f)
