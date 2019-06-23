import math
import seaborn
import matplotlib.pyplot as plt
import pandas as pd

# Constants
dt = 0.001
g = 9.81


# Vehicle Friction Sub-Problem
# Returns time and list of velocities over time.
def vehicle(dt):
    M = 1500
    mu = 0.38
    v = [20.1168]

    while v[-1] > 0:
        a = -0.27 * math.pow(v[-1], 3) / M - mu * g
        v.append(v[-1] + a * dt)

    return [dt * i for i in range(len(v))], v


# Impulse Momentum Sub-Problem
# Returns initial velocity along z
def impulse_momentum(t):
    F = 1.51 * math.pow(10, 6)
    m = 10 * math.pow(10, -3)
    return F * t / m


# Final Problem
# Returns something
def final_problem(vz0, dt, t_im):
    # Assumption vz function is vz0 until t = time from impulse momentum problem, and the given function for t greater than that time
    # Also assuming fourth root of vz is fourth root of magnitude of vz
    vz = lambda z, t: vz0/3 - 7*z/(2*t) + 5 * math.pow(t, 2/3) if t > t_im else vz0
    z = lambda vz, x, y, t: -0.5*math.pow(x, 2) + math.pow(y, 0.5) + (3*x*vz*t/(2*y) if t > 0 else 0) - 2*math.pow(abs(vz), 1/4)
    y = lambda x, t: -math.pow(t, 2) + 3 * x * t
    x = lambda t: 2*math.pow(t, 3) - math.pow(t, 2) + 5*t
    vx = lambda t: 6*t*t-2*t+5
    vy = lambda t, x, vx: -2*t + 3*x + 3*t*vx

    t = [0]
    xi = [0]
    yi = [0]
    zi = [0]
    vzi = [0]
    vxi = [0]
    vyi = [0]
    while t[-1] < 10:
        xi.append(x(t[-1]))
        yi.append(y(xi[-1], t[-1]))
        vxi.append(vx(t[-1]))
        vyi.append(vy(t[-1], xi[-1], vxi[-1]))
        vzi.append(vz(zi[-1], t[-1]))
        zi.append(z(vzi[-1], xi[-1], yi[-1], t[-1]))
        t.append(t[-1] + dt)

    return t, xi, yi, zi, vxi, vyi, vzi


t, v = vehicle(dt)
data = pd.DataFrame({'Time (s)': t, 'Velocity (m/s)': v})

seaborn.set_style('white')
seaborn.set_style('ticks')
seaborn.lineplot(x='Time (s)', y='Velocity (m/s)', data=data)
seaborn.despine()
plt.title('Vehicle Friction Sub-Problem Results')
plt.show()

print('t0: ' + str(t[-1]))

vz0 = impulse_momentum(t[-1])
print('Vz0: ' + str(vz0))

t, x, y, z, vx, vy, vz = final_problem(vz0, dt, t[-1])

M = 10 * math.pow(10, -3)

kinetic_energy = [0.5 * M * math.sqrt(vx[i]**2 + vy[i]**2 + vz[i]**2) for i in range(len(vx))]
potential_energy = [9.81*M*z[i] for i in range(len(z))]

x_t = pd.DataFrame({'Time (s)': t, 'X (m)': x})
y_t = pd.DataFrame({'Time (s)': t, 'Y (m)': y})
z_t = pd.DataFrame({'Time (s)': t, 'Z (m)': z})
vx_t = pd.DataFrame({'Time (s)': t, 'Velocity_X (m/s)': vx})
vy_t = pd.DataFrame({'Time (s)': t, 'Velocity_Y (m/s)': vy})
vz_t = pd.DataFrame({'Time (s)': t, 'Velocity_Z (m/s)': vz})
KE_t = pd.DataFrame({'Time (s)': t, 'Kinetic Energy (J)': kinetic_energy})
PE_t = pd.DataFrame({'Time (s)': t, 'Potential Energy (J)': potential_energy})

fig, axarr = plt.subplots(4, 2, figsize=(6, 6))

seaborn.lineplot(x='Time (s)', y='X (m)', data=x_t, ax=axarr[0][0])
seaborn.despine()
axarr[0][0].set_title('X Position vs Time')

seaborn.lineplot(x='Time (s)', y='Y (m)', data=y_t, ax=axarr[0][1])
seaborn.despine()
axarr[0][1].set_title('Y Position vs Time')

seaborn.lineplot(x='Time (s)', y='Z (m)', data=z_t, ax=axarr[1][0])
seaborn.despine()
axarr[1][0].set_title('Z Position vs Time')

seaborn.lineplot(x='Time (s)', y='Velocity_X (m/s)', data=vx_t, ax=axarr[1][1])
seaborn.despine()
axarr[1][1].set_title('Velocity X vs Time')

seaborn.lineplot(x='Time (s)', y='Velocity_Y (m/s)', data=vy_t, ax=axarr[2][0])
seaborn.despine()
axarr[2][0].set_title('Velocity Y vs Time')

seaborn.lineplot(x='Time (s)', y='Velocity_Z (m/s)', data=vz_t, ax=axarr[2][1])
seaborn.despine()
axarr[2][1].set_title('Velocity Z vs Time')

seaborn.lineplot(x='Time (s)', y='Kinetic Energy (J)', data=KE_t, ax=axarr[3][0])
seaborn.despine()
axarr[3][0].set_title('Kinetic Energy vs Time')

seaborn.lineplot(x='Time (s)', y='Potential Energy (J)', data=PE_t, ax=axarr[3][1])
seaborn.despine()
axarr[3][1].set_title('Potential Energy vs Time')

plt.show()
