
-- Create Physics subject
INSERT INTO subjects (school_id, name, code, category, is_islamic, is_vocational)
VALUES ('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'Physics', 'PHY', 'science', false, false);

-- Insert Physics JAMB past questions (correct_option must be A-D only)
INSERT INTO exam_questions (school_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation)
SELECT '1db1c085-c9c3-483e-941d-ea3b3f508bc7', s.id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.difficulty, q.explanation
FROM subjects s,
(VALUES
('Which of the following is NOT a vector quantity?', 'Force', 'Altitude', 'Weight', 'Displacement', 'B', 'easy', 'Altitude is a scalar quantity measuring height, not a vector.'),
('The force with which an object is attracted to the earth is called its', 'Acceleration', 'Mass', 'Weight', 'Impulse', 'C', 'easy', 'Weight is the gravitational force on an object.'),
('The refractive index of a liquid is 1.5. If the velocity of light in vacuum is 3.0 x 10⁸ m/s, the velocity of light in the liquid is', '1.5 x 10⁸ m/s', '2.0 x 10⁸ m/s', '3.0 x 10⁸ m/s', '4.5 x 10⁸ m/s', 'B', 'medium', 'v = c/n = 3.0×10⁸ / 1.5 = 2.0×10⁸ m/s'),
('If the relative density of a metal is 19, what will be the mass of 20cm³ of the metal?', '380g', '400g', '360g', '39g', 'A', 'medium', 'Mass = density × volume = 19 × 20 = 380g'),
('If the pressure on 1000cm³ of an ideal gas is doubled while its Kelvin temperature is halved, the new volume becomes', '250 cm³', '500 cm³', '100 cm³', '200 cm³', 'A', 'medium', 'V2 = V1×(P1/P2)×(T2/T1) = 1000×(1/2)×(1/2) = 250 cm³'),
('A ship receives an echo after 3.5s, then after 2.5s. If speed of sound is 250 m/s, how much closer is the ship?', '125 m', '175 m', '350 m', '10 m', 'A', 'medium', 'Difference = 250×(3.5-2.5)/2 = 125 m'),
('The wavelength of gamma rays is', 'Longer than 700nm', 'Between 400nm and 700nm', '550nm', 'Shorter than 400nm', 'D', 'easy', 'Gamma rays have very short wavelengths, shorter than visible light.'),
('A 24V potential difference is applied across a parallel combination of four 6-ohm resistors. The current in each resistor is', '1 A', '4 A', '16 A', '18 A', 'B', 'medium', 'Current in each = V/R = 24/6 = 4A'),
('The linear expansivity of brass is 2×10⁻⁵ °C⁻¹. Volume of brass 100cm³ at 0°C. Volume at 100°C is', '100.02 cm³', '100.04 cm³', '100.06 cm³', '100.20 cm³', 'C', 'medium', 'ΔV = V₀×3α×ΔT = 100×3×2×10⁻⁵×100 = 0.06. V = 100.06 cm³'),
('A force of 16N on a 4.0kg block at rest on smooth surface. Velocity at t=5s is', '4 m/s', '10 m/s', '20 m/s', '50 m/s', 'C', 'easy', 'a = F/m = 4 m/s². v = at = 20 m/s'),
('Ripples on water are similar to light waves because they both', 'Have the same wavelength', 'Are longitudinal', 'Cannot be reflected', 'Can be refracted and diffracted', 'D', 'easy', 'Both water ripples and light can be refracted and diffracted.'),
('A piece of wood floating on water experiences', 'Upthrust and reaction', 'Weight and reaction', 'Weight and upthrust', 'Upthrust and viscosity', 'C', 'easy', 'A floating object has weight downward and upthrust upward.'),
('Which is NOT a unit of power?', 'Joule/second', 'Ampere²×ohm', 'Volt²/ohm', 'Ohm²/volt', 'D', 'medium', 'Ohm²/volt is not a valid unit of power.'),
('The force on a charge of 0.2C in an electric field is 4N. The electric field intensity is', '0.8 N/C', '20.0 N/C', '4.2 N/C', '0.8 C/N', 'B', 'easy', 'E = F/q = 4/0.2 = 20 N/C'),
('The specific latent heat of vaporization is always', 'Less than specific latent heat of fusion', 'Greater than specific latent heat of fusion', 'Equal to specific latent heat of fusion', 'Depends on the substance', 'B', 'easy', 'More energy needed to change liquid to gas than solid to liquid.'),
('Longitudinal waves do not exhibit', 'Refraction', 'Reflection', 'Diffraction', 'Polarization', 'D', 'easy', 'Polarization only occurs in transverse waves.'),
('A machine has velocity ratio 5. It requires 50kg to overcome 200kg. The efficiency is', '4%', '5%', '40%', '80%', 'D', 'medium', 'MA = 200/50 = 4. Efficiency = 4/5 × 100 = 80%'),
('Atmospheric pressure supports mercury 0.76m high. If relative density of mercury is 13.6, height of water column is', '0 m', '10 m', '13 m', '14 m', 'B', 'medium', 'h = 0.76 × 13.6 ≈ 10 m'),
('A thin-walled thermometer bulb gives a short response time because', 'The bulb is large', 'The stem is thin', 'The bulb is thick-walled', 'The bulb is thin-walled and liquid is a good conductor', 'D', 'medium', 'Thin walls and good conductivity allow faster heat transfer.'),
('The distance-time² graph for a particle from rest is linear. The slope measures', 'Initial displacement', 'Initial velocity', 'Acceleration', 'Half the acceleration', 'D', 'medium', 's = ½at². Slope of s vs t² = ½a.'),
('For a concave mirror to form a real diminished image, the object must be placed', 'Behind the mirror', 'Between mirror and focus', 'Between focus and center of curvature', 'Beyond the center of curvature', 'D', 'medium', 'Object beyond C gives real diminished image.'),
('The unit quantity of electricity is called', 'The ampere', 'The volt', 'The coulomb', 'The ammeter', 'C', 'easy', 'The coulomb is the SI unit of electric charge.'),
('The resistance of a wire depends on', 'Length only', 'Diameter only', 'Temperature only', 'Length, diameter, temperature and resistivity', 'D', 'easy', 'Resistance depends on all these factors.'),
('For which quantities is ML²T⁻² correct? I. Moment of force II. Work III. Acceleration', 'I only', 'II only', 'III only', 'I and II', 'D', 'medium', 'Both torque and work have dimensions ML²T⁻².'),
('Volume of alcohol (density 840 kg/m³) with same mass as 4.2m³ of petrol (density 720 kg/m³) is', '1.4 m³', '3.6 m³', '4.9 m³', '5.0 m³', 'B', 'medium', 'V = 4.2×720/840 = 3.6 m³'),
('Two cells (1.5V, 2Ω each) in parallel connected to 1Ω resistor. Current is', '0.75 A', '1.5 A', '0.5 A', '1.0 A', 'A', 'medium', 'Parallel: emf=1.5V, r=1Ω. I = 1.5/2 = 0.75A'),
('High tension transmission is described as', 'High resistance, low voltage', 'Low current, high voltage', 'High current, low voltage', 'High voltage, zero current', 'B', 'easy', 'High tension = high voltage, low current to minimize losses.'),
('Heat in 5Ω by 2A for 30s evaporates 5g of liquid. Specific latent heat is', '120 J', '60 J/g', '120 J/g', '1500 J', 'C', 'medium', 'Q = I²Rt = 4×5×30 = 600J. L = 600/5 = 120 J/g'),
('Node to antinode distance in air column vibration equals', 'λ/4', 'λ/2', 'λ', '2λ', 'A', 'easy', 'Node-antinode distance is one quarter wavelength.'),
('Car from rest, acceleration 10 m/s² for 10s. Distance in last second is', '95 m', '100 m', '500 m', '905 m', 'A', 'medium', 'sn = u + a(2n-1)/2 = 0 + 10(19)/2 = 95 m'),
('2kg block acted on by 10N North and 10N East. Acceleration magnitude is', '0.10 m/s²', '7.07 m/s²', '10.00 m/s²', '14.14 m/s²', 'B', 'medium', 'F = √(100+100) = 14.14N. a = 14.14/2 = 7.07 m/s²'),
('5kg block just slides with 8N force. Coefficient of friction is', '0.16', '0.63', '0.80', '1.60', 'A', 'medium', 'μ = F/mg = 8/50 = 0.16'),
('Which is NOT a force?', 'Friction', 'Tension', 'Upthrust', 'Impulse', 'D', 'easy', 'Impulse = force × time, not a force itself.'),
('Mercury thermometer: fixed points 210mm apart, mercury 49mm above lower point. Temperature is', '55.3°C', '23.3°C', '49.0°C', '16.1°C', 'B', 'easy', 'T = (49/210)×100 = 23.3°C'),
('A solid changing directly to gas is called', 'Vaporization', 'Evaporation', 'Sublimation', 'Ionization', 'C', 'easy', 'Sublimation is direct solid to gas transition.'),
('Plane at 30°, efficiency 60%. Force to push 120N load up is', '60 N', '100 N', '120 N', '200 N', 'B', 'medium', 'Ideal effort = 120sin30° = 60N. Actual = 60/0.6 = 100N'),
('5kg body at rest, forces 12N and 5N perpendicular. Acceleration is', '0.40 m/s²', '1.40 m/s²', '2.60 m/s²', '3.40 m/s²', 'C', 'medium', 'F = √(144+25) = 13N. a = 13/5 = 2.6 m/s²'),
('Two tuning forks 256Hz, one loaded, 4 beats/s heard. Loaded fork frequency is', '260 Hz', '252 Hz', '248 Hz', '264 Hz', 'B', 'easy', 'Loading decreases frequency: 256-4 = 252 Hz'),
('Dew point is the temperature at which atmospheric water vapour', 'Turns to steam', 'Solidifies to ice', 'First condenses to liquid', 'Causes cooling', 'C', 'easy', 'Dew point is the condensation temperature.'),
('100W supplied to 0.01kg liquid for 20s raises temperature by 5°C. Specific heat capacity is', '2.0×10² J/(kg·K)', '2.0×10³ J/(kg·K)', '4.0×10⁴ J/(kg·K)', '4.0×10⁵ J/(kg·K)', 'C', 'medium', 'c = Pt/(mΔT) = 2000/(0.01×5) = 40000 J/(kg·K)'),
('Ideal gas: pressure doubled, temperature halved. Percentage volume change is', '0%', '25%', '75%', '300%', 'C', 'medium', 'V2 = V/4. Change = 75%'),
('Cathode rays are', 'Electromagnetic waves', 'Protons', 'Streams of electrons', 'Neutrons', 'C', 'easy', 'Cathode rays are streams of electrons.'),
('A device converting sound to electrical energy is', 'Horn of a car', 'A.C. generator', 'A microphone', 'Telephone earpiece', 'C', 'easy', 'A microphone converts sound to electrical energy.'),
('Atmospheric pressure 10⁵ N/m², density 1 kg/m³. Height of atmosphere is', '100 m', '1000 m', '10000 m', '100000 m', 'C', 'medium', 'h = P/(ρg) = 10⁵/(1×10) = 10000 m'),
('Inertia of a body is best described as', 'Ability to overcome gravity', 'Reluctance to stop moving', 'Readiness to start moving', 'Reluctance to start or stop moving', 'D', 'easy', 'Inertia resists any change in motion state.'),
('Pump lifts 1000kg through 10m in 10s. Power is', '1.0 kW', '10.0 kW', '12.5 kW', '15.0 kW', 'B', 'easy', 'P = mgh/t = 1000×10×10/10 = 10 kW'),
('Apparent colour of red shirt in pure green light is', 'Red', 'Green', 'Yellow', 'Black', 'D', 'easy', 'Red shirt absorbs green, reflects nothing → appears black.'),
('White light spectrum order is', 'Blue, red, green, yellow, indigo, violet, orange', 'Red, orange, yellow, green, blue, indigo, violet', 'Red, orange, yellow, indigo, green, blue, violet', 'Indigo, green, blue, violet, yellow, red, orange', 'B', 'easy', 'ROYGBIV is the correct order.'),
('Cost of running 5×50W + 4×100W lamps for 10h at 2 kobo/kWh is', '₦0.65', '₦0.13', '₦3.90', '₦39.00', 'B', 'medium', 'Power = 650W. Energy = 6.5 kWh. Cost = 13 kobo = ₦0.13'),
('Which is NOT a fundamental SI unit?', 'Metre', 'Ampere', 'Kelvin', 'Radian', 'D', 'easy', 'Radian is supplementary, not fundamental.'),
('Pendulum period 2.0s, length doubled. New period is', '1.00 s', '1.41 s', '2.83 s', '4.00 s', 'C', 'medium', 'T ∝ √L. T2 = 2×√2 = 2.83 s')
) AS q(question_text, option_a, option_b, option_c, option_d, correct_option, difficulty, explanation)
WHERE s.name = 'Physics' AND s.school_id = '1db1c085-c9c3-483e-941d-ea3b3f508bc7';
