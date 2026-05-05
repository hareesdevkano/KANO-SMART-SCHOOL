
-- Create Literature in English subject
INSERT INTO subjects (id, school_id, name, code, category, is_islamic, is_vocational)
VALUES ('b2c3d4e5-6789-0123-bcde-f01234567890', '1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'Literature in English', 'LIT', 'Arts', false, false);

-- Insert Literature in English JAMB Past Questions (1983-1987)
INSERT INTO exam_questions (school_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty) VALUES

-- 1983 Questions
('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Marcus Antonius roused the public to mutiny in his funeral speech in Julius Caesar partly because he succeeded in discrediting Brutus and Cassius by calling them ''honorable men'', when in fact he consciously organized his speech to prove that they were dishonorable. This device is known as',
'Allegory', 'Hyperbole', 'Irony', 'Paradox',
'C', 'This is dramatic irony - saying one thing while meaning the opposite. Antony repeatedly calls Brutus honorable while proving he is not.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''O Julius Caesar! thou art mighty yet! Thy spirit walks abroad and turns our swords in our own proper entrails.'' These lines were spoken by',
'Cassius before the corpse of Brutus', 'Cassius before the corpse of Caesar', 'Brutus before the corpse of Cassius', 'Titinius before the corpse of Cato',
'C', 'These lines are spoken by Brutus after finding Cassius dead, acknowledging that Caesar''s spirit has prevailed even in death.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''Night hangs upon mine eyes; my bones would rest, that have but laboured to attain this hour.'' Brutus'' words come',
'After the conclusion of the plan to kill Caesar', 'Soon after his wife insisted to know the object of his unusual brooding', 'As part of his famous address to his fellow Romans', 'After his defeat by the forces of Octavius and Antony',
'D', 'These are Brutus'' final words before his death after being defeated at the Battle of Philippi.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''There is a tide in the affairs of men, Which, taken at the flood, leads on to fortune; Omitted, all the voyage of their life is bound in shallows and in miseries.'' This is a statement made by',
'Antony, urging Caesar to take the crown', 'Cassius, urging Brutus to join the struggle to remove Caesar', 'Brutus, urging that Cassius and himself lead out their forces to meet those of Antony and Octavius at Philippi', 'Casca, urging that the conspirators explain their cause to the populace',
'C', 'Brutus uses this metaphor to convince Cassius that they should march to Philippi to face their enemies rather than wait.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Most of the information in The Trials of Brother Jero is conveyed when Brother Jero speaks to himself in dramatic monologues otherwise known as',
'Stream of consciousness technique', 'Personal conversation', 'Dialogue', 'Soliloquy',
'D', 'A soliloquy is when a character speaks their thoughts aloud while alone on stage. Brother Jero frequently uses this device.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Amope was introduced as a character into The Trials of Brother Jero primarily to dramatize the',
'Tragedy of unfaithful wives', 'Near realization of the curse hanging on Brother Jero', 'Disadvantage of marrying an uneducated woman', 'Evils of street trading by women',
'B', 'Amope represents the threat of the curse - that Jero would be undone by a woman. Her presence nearly brings about his downfall.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The hero of The Trials of Brother Jero is',
'Amope', 'The Old Prophet', 'The politician', 'Brother Jero',
'D', 'Brother Jero is the protagonist and title character of Soyinka''s play.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Soyinka''s main concern in The Trials of Brother Jero is to',
'Expose the corrupt politicians in the society', 'Expose the religious charlatans in the society', 'Expose women''s power of seduction', 'Condemn men who beat their wives',
'B', 'The play is primarily a satire on religious hypocrisy and the exploitation of gullible followers by fake prophets.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'In The Trials of Brother Jero, Brother Jero himself identifies his main weakness as',
'Avarice', 'Treachery', 'Lustfulness', 'Self-doubt',
'C', 'Brother Jero confesses in his soliloquy that his weakness is women - he is lustful and this nearly causes his downfall.', 'medium'),

-- 1984 Questions
('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'In Julius Caesar, we learn that political success depends largely on',
'Virtue, honesty and patriotism', 'Cunning and a readiness to make use of others', 'A strong body and good career as a soldier', 'A sound training in political science',
'B', 'The play shows that political success requires cunning and manipulation, as demonstrated by Antony''s manipulation of the crowd.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''Hence! Wilt thou lift up Olympus?'' is a memorable line from Julius Caesar by',
'Brutus', 'Mark Antony', 'Octavius Caesar', 'Julius Caesar',
'D', 'Julius Caesar speaks this line when refusing to pardon Publius Cimber, comparing himself to Mount Olympus - immovable.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The combined reactions of the plebeians after the separate speeches of Brutus and Antony show that the common man as portrayed in Julius Caesar',
'Is knowledgeable, has a mind of his own, and is reliable', 'Is fickle-minded, changeable and not dependable', 'Considers Caesar a tyrant and wants him killed', 'Does not consider Caesar an over-ambitious man deserving death',
'B', 'The crowd first supports Brutus, then immediately switches allegiance after Antony''s speech, showing their fickle nature.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Brutus joined the conspiracy against Caesar because he',
'Knew that Caesar was ambitious', 'Was a great lover of freedom', 'Was made to believe that Caesar was ambitious', 'Respected Casca and had a high opinion of Cassius',
'C', 'Cassius manipulated Brutus through forged letters and persuasion to believe Caesar''s ambition would destroy the Republic.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'What literary mode best describes Soyinka''s The Trials of Brother Jero?',
'Tragedy', 'Satire', 'Tragi-comedy', 'Epic',
'B', 'The play is a satire that uses humor and irony to critique religious charlatanism in Nigerian society.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Brother Jero''s attitude to his vocation is',
'Self-denying', 'Commercial', 'Philanthropic', 'Nonchalant',
'B', 'Brother Jero treats his prophetic calling as a business, using it to exploit and manipulate his followers for personal gain.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Of the issues raised by Wole Soyinka in The Trials of Brother Jero, the most central deals with the',
'Frustration of an incompatible marriage', 'Rivalry of religious sects', 'Negative qualities of women', 'Evil of religious demagogy',
'D', 'The central theme is religious demagogy - how self-appointed prophets exploit the gullible masses.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The ''curse'' the old master put on Brother Jero is that he would',
'Drown in water', 'Be killed by armed robbers', 'Come to ruin by women', 'Lose his prophetic visions',
'C', 'The Old Prophet cursed Jero that a woman would be his downfall, which becomes a recurring threat throughout the play.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''Vanished. Transported. Utterly transmuted. I knew it. I knew I stood in the presence of God...'' This statement of ecstasy in The Trials of Brother Jero was made by',
'Brother Jero', 'Chume', 'The old prophet', 'The unnamed member of parliament',
'D', 'The unnamed member of parliament makes this ecstatic statement, showing how easily Jero manipulates his followers.', 'medium'),

-- 1985 Questions
('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Because of his fiery temper as a youth, Odewale in The Gods Are Not To Blame was called the',
'Gorilla', 'Scorpion', 'Humbler of the wild', 'Thunder lion',
'B', 'Odewale was nicknamed the Scorpion due to his fierce and aggressive temperament as a young man.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''Is Aderopo jealous that I am sharing a bed with his mother? Very well then, let him come and sleep with his mother.'' Odewale''s statement is a good example of',
'Euphemism', 'Pun', 'Irony', 'Sarcasm',
'C', 'This is dramatic irony because Odewale unknowingly speaks a truth he does not realize - Ojuola is actually his own mother.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''Just because I am an Ijebu man, and do not belong to your tribe, the sight of me as your king gnaws at your liver...'' The speaker''s statement is prompted by',
'Guilty conscience', 'Oedipus complex', 'Delusive grandeur', 'Persecution complex',
'D', 'Odewale''s belief that people are against him because of his tribal origin shows a persecution complex.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The exchange between Odewale and Ojuola where she says ''It is you I married, your highness, not my son'' from The Gods Are Not To Blame is an example of',
'Flashback technique', 'Dramatic irony', 'Poetic licence', 'False analogy',
'B', 'This is dramatic irony because the audience knows Ojuola is actually Odewale''s mother, making this statement deeply ironic.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''He was a living example of the astonishing results that can occur when Western hypocrisy and commercial materialism are grafted on to a first-rate African intelligence.'' The character described is the father of',
'Niam', 'Endongolo', 'Zambo', 'Medza',
'D', 'This describes the father of Medza in Mongo Beti''s Mission to Kala, a character who represents cultural hybridity.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'In which London neighborhood mentioned in Great Expectations is Mr. Jaggers'' office located?',
'Hammersmith', 'Soho', 'Walworth', 'Little Britain',
'D', 'Mr. Jaggers'' law office is located in Little Britain, a street in the City of London, in Dickens'' Great Expectations.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The major lesson Pip''s experience in Great Expectations teaches us is that',
'It is not good to be born poor', 'Wealth guarantees happiness', 'An orphan has to be industrious to survive', 'Ambition should be moderated by fairness and human consideration for others',
'D', 'Pip learns that true worth comes from character, not social status, and that ambition must be tempered with compassion.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Miss Havisham grooms Estella the way she does so as to make Estella',
'A model lady', 'A good wife to Pip', 'A dependable character', 'A means of torturing menfolk',
'D', 'Miss Havisham raises Estella to be cold and heartless towards men as revenge for being jilted on her wedding day.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The characters of Joe and Biddy are contrasted with those of Pip and Estella in order to show',
'The advantages of formal education', 'The advantages of simplicity, sincerity and true love', 'The advantages of sophisticated high-class living', 'The difference between urban and rural people',
'B', 'Joe and Biddy represent genuine love and simplicity, contrasting with the pretensions and unhappiness of Pip and Estella.', 'medium'),

-- 1986 Questions
('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''The oracle warns us that we have left our pot unwatched, and our food now burns.'' This statement in The Gods Are Not To Blame refers to',
'The killing of Adetusa', 'The crime of incest committed by King Odewale', 'Aderopo''s quarrel with King Odewale', 'The banishment of Aderopo',
'B', 'The oracle''s warning refers to the plague caused by Odewale''s unknowing crime of incest with his mother Ojuola.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''...the toad likes water but not when the water is boiling.'' King Odewale in The Gods Are Not To Blame uses this proverb to explain why he',
'Exiled himself from the home of his supposed parents', 'Exiled Aderopo from his presence', 'Treated Baba Fakunle with disrespect', 'No longer likes the land of Kutuje',
'A', 'Odewale uses this proverb to explain why he left his adoptive parents - he loved them but could not stay after hearing the prophecy.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Baba Fakunle ordered his boy to return nine of the ten cowries given by the King because he',
'Wanted to spite the King by taking only one cowrie', 'Felt insulted that he was given only ten cowries', 'Did not want to meddle with leprous money given with bloody hands', 'Wanted to emphasize that the messenger of Olodumare takes only one cowrie',
'D', 'As a priest of Olodumare, Baba Fakunle demonstrates his spiritual authority by accepting only one cowrie - the traditional fee.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''When the frog in front falls in a pit, others behind take caution... When crocodiles eat their own eggs, what will they not do to the flesh of a frog?'' The speaker alleges that King Adetusa',
'Died falling into a pit', 'Fell victim to man-eating crocodiles', 'Was killed by the people of Kutuje', 'Was killed by the Ijekun people',
'C', 'The proverb suggests that if the people of Kutuje could kill their own king (Adetusa), they could do worse to a stranger like Odewale.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Odewale shifts the blame for his tragedy from the gods to himself and claims that his tragedy is a result of his own weakness. The weakness he claims is love of',
'Power', 'Adventure', 'His tribe', 'Divination',
'C', 'Odewale ultimately blames his love of his Ijekun tribe as the weakness that led to his tragedy - his tribalism blinded him.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The treatment meted out to Cinna the poet in Julius Caesar shows',
'That Roman soldiers despised poets generally', 'Shakespeare''s use of mistaken identity for comic effect', 'The misfortune of Roman poets', 'The spontaneous reaction of the plebeians after the assassination of Caesar',
'D', 'The mob''s killing of Cinna the poet (mistaken for Cinna the conspirator) demonstrates the dangerous, irrational violence of the crowd.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The specific case cited by Antony in his funeral oration to show that Caesar was not as ambitious as Brutus made him out to be was that Caesar had',
'Refused to take ransom after his victory', 'Pardoned all his captives', 'Thrice refused the crown during the feast of Lupercal', 'Been a friend of the senators',
'C', 'Antony argues that Caesar''s thrice refusal of the crown at the Lupercal proves he was not the ambitious tyrant Brutus claimed.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'Shakespeare based the story of Julius Caesar on',
'Actual historical records', 'Plutarch''s Lives', 'Greek mythology', 'John Bunyan''s works',
'B', 'Shakespeare''s Julius Caesar is primarily based on Sir Thomas North''s translation of Plutarch''s Lives of the Noble Greeks and Romans.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''He would be crowned. How that might change his nature, there''s the question. It is the bright day that brings forth the adder, and that craves wary walking.'' The crowning of Julius Caesar is presented as',
'Extremely desirable', 'Bound to change Caesar''s nature for the better', 'Bound to promote the breeding of adders', 'Something to be approached with great caution',
'D', 'Brutus uses the metaphor of a snake emerging on a bright day to suggest that power (crowning) could corrupt Caesar and must be treated cautiously.', 'hard'),

-- 1987 Questions
('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'In the play The Gods Are Not To Blame, Odewale became King of Kutuje by',
'Usurpation in a typical Ijekun manner', 'Deserting the people of Ikolu whose army he led', 'Divulging the war secrets of Ikolu to Kutuje', 'Leading Kutuje in a war against Ikolu',
'D', 'Odewale became King of Kutuje by leading their army to victory against Ikolu, earning the people''s gratitude and the throne.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''No, let them attack me. Is it not Ignorance that makes the rat attack the cat?'' The one weapon to which the speaker in The Gods Are Not To Blame refers is',
'Prophecy', 'Courage', 'Truth', 'Justice',
'C', 'Baba Fakunle claims truth as his only weapon - as a seer, he speaks the truth regardless of the consequences.', 'medium'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''Then let these eyes around me close, close close in sleep... That is my word - the mountain always sleeps. Sleep... Sleep...'' These lines from The Gods Are Not To Blame were chanted by',
'Iya Aburo to mesmerize her son', 'Baba Fakunle to mesmerize his assailants', 'Odewale to mesmerize his assailants', 'Old man to mesmerize Odewale',
'D', 'The old man chants these hypnotic words to put Odewale to sleep, preventing further violence.', 'hard'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'''But Obatala, God of Creation, has a way of consoling the distressed.'' The consolation referred to in The Gods Are Not To Blame is the',
'Great peace that reigned in the land of Kutuje', 'Subjugation of the warlike people of Ikolu', 'Pregnancy of Aburo, Odewale''s second wife', 'Birth of Aderopo by Ojuola',
'D', 'The consolation refers to the birth of Aderopo by Ojuola, which was seen as a blessing from Obatala.', 'medium'),

-- Additional general literature questions
('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'A literary work in which the characters and events are used as symbols is called',
'An allegory', 'A fable', 'A legend', 'A parable',
'A', 'An allegory is a narrative in which characters and events symbolize deeper moral, spiritual, or political meanings.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'A poem of fourteen lines with a specific rhyme scheme is called a',
'Ballad', 'Sonnet', 'Limerick', 'Haiku',
'B', 'A sonnet is a 14-line poem, typically in iambic pentameter, following specific rhyme schemes (Shakespearean or Petrarchan).', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The use of words whose sounds suggest their meaning is called',
'Alliteration', 'Onomatopoeia', 'Assonance', 'Consonance',
'B', 'Onomatopoeia is the use of words that phonetically imitate the sound they describe, such as buzz, hiss, or splash.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'A figure of speech in which an exaggerated statement is made for emphasis is called',
'Metaphor', 'Simile', 'Hyperbole', 'Litotes',
'C', 'Hyperbole is deliberate exaggeration for emphasis or effect, not meant to be taken literally.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'When a character in a play speaks his thoughts aloud while alone on stage, it is called a',
'Monologue', 'Dialogue', 'Soliloquy', 'Aside',
'C', 'A soliloquy is a speech delivered by a character alone on stage, revealing their inner thoughts and feelings to the audience.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The feeling or atmosphere created by a literary work is called the',
'Theme', 'Mood', 'Tone', 'Setting',
'B', 'Mood refers to the emotional atmosphere that a literary work creates for the reader through word choice, imagery, and setting.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The repetition of initial consonant sounds in consecutive or closely positioned words is called',
'Assonance', 'Alliteration', 'Rhyme', 'Rhythm',
'B', 'Alliteration is the repetition of the same initial consonant sound, as in ''Peter Piper picked a peck of pickled peppers''.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'A story that is told to teach a moral lesson, often using animals as characters, is called a',
'Legend', 'Myth', 'Fable', 'Epic',
'C', 'A fable is a short story, typically with animals as characters, conveying a moral lesson, like Aesop''s Fables.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'The main character who opposes the protagonist in a literary work is called the',
'Villain', 'Antagonist', 'Anti-hero', 'Foil',
'B', 'The antagonist is the character or force that opposes the protagonist, creating the central conflict of the story.', 'easy'),

('1db1c085-c9c3-483e-941d-ea3b3f508bc7', 'b2c3d4e5-6789-0123-bcde-f01234567890',
'A comparison between two unlike things using ''like'' or ''as'' is called a',
'Metaphor', 'Simile', 'Personification', 'Hyperbole',
'B', 'A simile is a figure of speech that directly compares two different things using connecting words such as ''like'' or ''as''.', 'easy');
