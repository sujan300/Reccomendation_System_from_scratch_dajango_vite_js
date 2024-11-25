import math

# Define the vector
vector = [23, 56, 72, 8, 94, 14, 38, 65, 41, 33]

# # Calculate the magnitude
# magnitude = math.sqrt(sum(x**2 for x in vector))

# # Check if it's a unit vector
# if magnitude == 1:
#     print("The vector is a unit vector. Magnitude ",magnitude)
# else:
#     print("The vector is not a unit vector.",magnitude)


def squire(x):
    return x**2

x = map(squire,vector)

print("the list is ",sum(list(x)))