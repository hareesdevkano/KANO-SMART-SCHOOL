
-- Create Mathematics subject
INSERT INTO subjects (id, school_id, name, code, category, is_islamic, is_vocational)
VALUES ('a1b2c3d4-5678-9012-abcd-ef0123456789', '1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'Mathematics', 'MTH', 'Science', false, false);

-- Insert Mathematics JAMB Past Questions (1983-1986)
INSERT INTO exam_questions (school_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty) VALUES

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If M represents the median and D the mode of the measurements 5, 9, 3, 5, 8 then (M,D) is',
'(6,5)', '(5,8)', '(5,7)', '(5,5)',
'D', 'Arranging: 3,5,5,8,9. Median=5, Mode=5. So (M,D)=(5,5)', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A construction company is owned by two partners X and Y and it is agreed that their profit will be divided in the ratio 4:5. At the end of the year, Y received ₦5,000 more than X. What is the total profit of the company for the year?',
'₦20,000', '₦25,000', '₦30,000', '₦45,000',
'D', 'Difference is 1 part = ₦5,000. Total parts = 9. Total = 9 x 5,000 = ₦45,000', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Given a regular hexagon, calculate each interior angle of the hexagon.',
'60 degrees', '30 degrees', '120 degrees', '45 degrees',
'C', 'Interior angle of regular hexagon = (6-2) x 180/6 = 120 degrees', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If x = 1 is a root of the equation x³ - 2x² - 5x + 6, find the other roots',
'-3 and 2', '-2 and 2', '3 and -2', '1 and 3',
'C', 'Dividing x³-2x²-5x+6 by (x-1) gives x²-x-6 = (x-3)(x+2). Roots are 3 and -2.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If x is jointly proportional to the cube of y and the fourth power of z. In what ratio is x increased or decreased when y is halved and z is doubled?',
'4:1 increase', '2:1 increase', '1:4 decrease', '1:1 no change',
'B', 'x = ky³z⁴. New x = k(y/2)³(2z)⁴ = k(y³/8)(16z⁴) = 2ky³z⁴. So 2:1 increase.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If 0.0000152 x 0.00042 = A x 10^B, where 1 ≤ A < 10, find A and B.',
'A = 9, B = 6.38', 'A = 6.38, B = -9', 'A = 6.38, B = 9', 'A = 6.38, B = -1',
'B', '0.0000152 x 0.00042 = 1.52 x 10⁻⁵ x 4.2 x 10⁻⁴ = 6.384 x 10⁻⁹. So A=6.38, B=-9.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If x + 2 and x - 1 are factors of the expression lx³ + 2kx² + 24, find the values of l and k',
'l = -6, k = -9', 'l = -2, k = 1', 'l = -2, k = -1', 'l = 0, k = 1',
'A', 'Substituting x=-2 and x=1 into the expression and solving simultaneously gives l=-6, k=-9.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The scores of a set of final year students are 41, 29, 55, 21, 47, 70, 70, 40, 43, 56, 73, 23, 50, 50. Find the median of the scores.',
'47', '48.5', '50', '48',
'B', 'Arranged: 21,23,29,40,41,43,47,50,50,55,56,70,70,73. Median = (47+50)/2 = 48.5', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The letters of the word MATRICULATION are cut and put into a box. One letter is drawn at random. Find the probability of drawing a vowel.',
'2/13', '5/13', '6/13', '8/13',
'C', 'MATRICULATION has 13 letters. Vowels: A,I,U,A,I,O = 6 vowels. P = 6/13.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The scores of 16 students in a Mathematics test are 65, 65, 55, 60, 60, 65, 60, 70, 75, 70, 65, 70, 60, 65, 65, 70. What is the sum of the median and modal scores?',
'125', '130', '140', '150',
'B', 'Mode = 65 (appears 6 times). Median = 65. Sum = 65+65 = 130.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If a rod of length 250 cm is measured as 255 cm, what is the percentage error in measurement?',
'55%', '10%', '5%', '2%',
'D', 'Error = 5cm. Percentage error = (5/250) x 100 = 2%', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Without using tables find the numerical value of log₇49 + log₇(1/7).',
'1', '2', '3', '0',
'A', 'log₇49 = 2. log₇(1/7) = -1. Sum = 2 + (-1) = 1.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Factorize completely 81a⁴ - 16b⁴',
'(3a + 2b)(2a - 3b)(9a² + 4b²)', '(3a - 2b)(2a - 3b)(4a² - 9b²)', '(3a - 2b)(3a + 2b)(9a² + 4b²)', '(3a - 2b)(2a - 3b)(9a² + 4b²)',
'C', '81a⁴ - 16b⁴ = (9a² + 4b²)(9a² - 4b²) = (9a² + 4b²)(3a + 2b)(3a - 2b)', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'One interior angle of a convex hexagon is 170 degrees and each of the remaining interior angles is equal to x degrees. Find x.',
'120', '110', '105', '102',
'B', 'Sum of interior angles = (6-2) x 180 = 720. 170 + 5x = 720. 5x = 550. x = 110.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A ship H leaves a port P and sails 30km due South. Then it sails 60km due west. What is the bearing of H from P?',
'026 degrees 34 minutes', '243 degrees 26 minutes', '116 degrees 34 minutes', '011 degrees',
'B', 'tan θ = 60/30 = 2. θ = 63 degrees 26 minutes. Bearing = 180 + 63.43 = 243 degrees 26 minutes', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'In a triangle PQR, QR = 3cm, PR = 3cm, PQ = 3cm. Find angles P and R.',
'P = 60 and R = 90', 'P = 30 and R = 120', 'P = 90 and R = 60', 'P = 60 and R = 60',
'D', 'Since PQ = QR = PR = 3cm, the triangle is equilateral. All angles = 60 degrees.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Find the mean of the following: 24.57, 25.63, 25.32, 26.01, 25.77',
'25.12', '25.30', '25.26', '25.50',
'C', 'Mean = (24.57 + 25.63 + 25.32 + 26.01 + 25.77)/5 = 127.30/5 = 25.26', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Simplify (2/3 - 1/5) - 1/3 of 2/5',
'3 and 1/2', '1/7', '1/3', '3',
'C', '(2/3 - 1/5) = 7/15. 1/3 of 2/5 = 2/15. 7/15 - 2/15 = 5/15 = 1/3.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If 263 + 441 = 714, what number base has been used?',
'12', '11', '10', '9',
'D', 'In base 9: 3+1=4, 6+4=11 (write 1 carry 1), 2+4+1=7. Result: 714. Base 9.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'P sold his bicycle to Q at a profit of 10%. Q sold it to R for ₦209 at a loss of 5%. How much did the bicycle cost P?',
'₦200', '₦196', '₦180', '₦205',
'A', 'Q bought at 1.1P and sold at 0.95 x 1.1P = 209. 1.045P = 209. P = 200.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A man invested a total of ₦50,000 in two companies. If these companies pay dividends of 6% and 8% respectively, how much did he invest at 8% if the total yield is ₦3,700?',
'₦15,000', '₦29,600', '₦21,400', '₦35,000',
'D', 'Let x = amount at 8%. 0.06(50000 - x) + 0.08x = 3700. 3000 + 0.02x = 3700. x = 35,000.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Thirty boys and x girls sat for a test. The mean of the boys scores and that of the girls were respectively 6 and 8. Find x if the total score was 468.',
'38', '24', '36', '22',
'C', '30 x 6 + 8x = 468. 180 + 8x = 468. 8x = 288. x = 36.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The cost of production of an article is: Labour ₦70, Power ₦15, Materials ₦30, Miscellaneous ₦5. Find the angle of the sector representing labour in a pie chart.',
'210 degrees', '105 degrees', '175 degrees', '150 degrees',
'A', 'Total = 120. Labour angle = (70/120) x 360 = 210 degrees', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Bola chooses at random a number between 1 and 300. What is the probability that the number is divisible by 4?',
'1/3', '1/4', '1/5', '4/300',
'B', 'Numbers divisible by 4 from 1-300: 75. P = 75/300 = 1/4.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A trader bought 103 (base 5) oranges at M14 (base 5) each. If he sold them at M24 (base 5) each, what will be his gain?',
'M103 (base 5)', 'M1030 (base 5)', 'M102 (base 5)', 'M2002 (base 5)',
'B', '103₅ = 28. Cost per orange: 14₅ = 9. Sell per orange: 24₅ = 14. Gain = 28 x 5 = 140 = 1030₅.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'p varies directly as the square of q and inversely as r. If p = 36 when q = 3 and r = 4, find p when q = 5 and r = 2.',
'72', '100', '90', '200',
'D', 'p = kq²/r. 36 = k(9)/4. k = 16. p = 16(25)/2 = 200.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Factorise 6x² - 14x - 12',
'2(x + 3)(3x - 2)', '6(x - 2)(x + 1)', '2(x - 3)(3x + 2)', '6(x + 2)(x - 1)',
'C', '6x² - 14x - 12 = 2(3x² - 7x - 6) = 2(x - 3)(3x + 2)', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A straight line y = mx meets the curve y = x² - 12x + 40 in two distinct points. If one of them is (5,5), find the other.',
'(5,6)', '(8,8)', '(8,5)', '(7,7)',
'B', 'At (5,5): m = 1. y = x meets x² - 12x + 40: x = x² - 12x + 40, x² - 13x + 40 = 0, (x-5)(x-8) = 0. Other point: (8,8).', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Two fair dice are rolled. What is the probability that both show the same number of points?',
'1/36', '7/36', '1/2', '1/6',
'D', 'Same number: (1,1),(2,2),(3,3),(4,4),(5,5),(6,6) = 6 outcomes. P = 6/36 = 1/6.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The larger value of y for which (y - 1)² = 4y - 7 is',
'2', '4', '6', '7',
'B', 'y² - 2y + 1 = 4y - 7. y² - 6y + 8 = 0. (y-2)(y-4) = 0. Larger value is 4.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Without using tables, evaluate Log₂4 + Log₄2 - Log₂₅5',
'1/2', '1/5', '0', '2',
'D', 'Log₂4 = 2. Log₄2 = 1/2. Log₂₅5 = 1/2. So 2 + 1/2 - 1/2 = 2.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Find x if Log₉x = 1.5',
'72.0', '27.0', '36.0', '3.5',
'B', 'Log₉x = 3/2. x = 9^(3/2) = 27.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Find the values of p for which the equation x² - (p-2)x + 2p + 1 = 0 has equal roots.',
'(0, 12)', '(1, 2)', '(21, 0)', '(4, 5)',
'A', 'Discriminant = 0: (p-2)² - 4(2p+1) = 0. p² - 12p = 0. p(p-12) = 0. p = 0 or p = 12.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If the hypotenuse of a right-angle isosceles triangle is 2, what is the length of each of the other sides?',
'√2', '1/√2', '2√2', '1',
'A', 'a² + a² = 4. 2a² = 4. a = √2.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If two fair coins are tossed, what is the probability of getting at least one head?',
'1/4', '1/2', '1', '3/4',
'D', 'P(at least one head) = 1 - P(no head) = 1 - 1/4 = 3/4.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The ratio of the lengths of two similar rectangular blocks is 2:3. If the volume of the larger block is 351 cm³, what is the volume of the smaller block?',
'234.00 cm³', '526.50 cm³', '166.00 cm³', '104.00 cm³',
'D', 'Volume ratio = (2/3)³ = 8/27. Smaller volume = 351 x 8/27 = 104 cm³.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'The bearing of a bird on a tree from a hunter on the ground is N72E. What is the bearing of the hunter from the bird?',
'S18W', 'S72W', 'S72E', 'S27E',
'B', 'The reverse bearing of N72E is S72W.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Solve the simultaneous equations: 2x + y = 4 and x² + xy = -12',
'(6,-8) and (-2,8)', '(3,-4) and (-1,4)', '(8,-4) and (-1,4)', '(-8,6) and (8,-2)',
'A', 'y = 4 - 2x. x² + x(4-2x) = -12. -x² + 4x + 12 = 0. x² - 4x - 12 = 0. (x-6)(x+2) = 0.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A solid sphere of radius 4cm has a mass of 64kg. What is the mass of a shell of the same metal with internal radius 2cm and external radius 3cm?',
'5 kg', '16 kg', '19 kg', '25 kg',
'C', 'Density = 64 / ((4/3)π x 64) = 3/(4π). Shell volume = (4/3)π(27-8) = 76π/3. Mass = 64 x 19/64 = 19 kg.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Without using tables, calculate the value of 1 + sec²30.',
'7/3', '2', '4/3', '3/4',
'A', 'sec30 = 2/√3. sec²30 = 4/3. 1 + 4/3 = 7/3.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Find the area of a regular hexagon inscribed in a circle of radius 8cm.',
'16√3 cm²', '96√3 cm²', '192√3 cm²', '32 cm²',
'B', 'Area = (3√3/2) x r² = (3√3/2) x 64 = 96√3 cm².', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Evaluate (212)₃ - (121)₃ + (222)₃',
'(1000)₃', '(313)₃', '(1020)₃', '(1222)₃',
'C', '212₃ = 23, 121₃ = 16, 222₃ = 26. 23 - 16 + 26 = 33 = 1020₃.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'If Musa scored 75 in Biology instead of 57, his average mark in four subjects would have been 60. What was his total mark?',
'282', '240', '222', '210',
'C', 'With 75: total = 4 x 60 = 240. Actual total = 240 - 75 + 57 = 222.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Divide the L.C.M. of 48, 64 and 80 by their H.C.F.',
'20', '30', '48', '60',
'D', 'LCM(48,64,80) = 960. HCF(48,64,80) = 16. 960/16 = 60.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Find the smallest number by which 252 can be multiplied to obtain a perfect square.',
'2', '3', '5', '7',
'D', '252 = 2² x 3² x 7. Multiply by 7 to get 1764 = 42².', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'Three boys shared some oranges. The first received 1/3 of the oranges, the second received 2/3 of the remainder. If the third boy received the remaining 12 oranges, how many oranges did they share?',
'60', '54', '48', '42',
'B', 'First gets x/3. Remainder = 2x/3. Second gets 2/3 of 2x/3 = 4x/9. Third = 2x/9 = 12. x = 54.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'A bag contains 4 white balls and 6 red balls. Two balls are taken without replacement. What is the probability that they are both red?',
'1/3', '2/9', '2/15', '1/5',
'A', 'P = 6/10 x 5/9 = 30/90 = 1/3.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'a1b2c3d4-5678-9012-abcd-ef0123456789',
'In a class of 120 students, 18 scored an A grade in Mathematics. What is the angle Z at the centre of a pie chart representing A grade students?',
'15 degrees', '28 degrees', '50 degrees', '54 degrees',
'D', 'Z = (18/120) x 360 = 54 degrees.', 'easy');
