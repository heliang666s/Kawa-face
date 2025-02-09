def fibonacci_recursive(n):
    if n == 0:
        return 0
    elif n == 1:
        return 1
    else:
        return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
    
def generate_fibonacci_sequence(n):
    return [fibonacci_recursive(i) for i in range(n)]

n = 10
result = generate_fibonacci_sequence(n)
print(result)