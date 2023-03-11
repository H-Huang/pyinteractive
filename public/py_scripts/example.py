import numpy as np
# Example for numpy broadcasting
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
print(a + b)
print(a * b)
print(a + 1)
print(a * 2)
c = np.array([[1, 2, 3], [4, 5, 6]])
d = np.array([[1, 2, 3]])
print(c + d)
print(c * d)
print(c + 1)
print(c * 2)