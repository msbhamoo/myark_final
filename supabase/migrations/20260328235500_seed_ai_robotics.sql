-- Seed script for 50 AI and Robotics questions, plus a Competition Quiz

DO $$
DECLARE
  ai_id uuid;
  robo_id uuid;
  new_quiz_id uuid;
BEGIN
  -- Get the subject IDs
  SELECT id INTO ai_id FROM quiz_subjects WHERE slug = 'coding-ai' LIMIT 1;
  SELECT id INTO robo_id FROM quiz_subjects WHERE slug = 'robotics' LIMIT 1;
  
  -- Insert Coding & AI Questions
  IF ai_id IS NOT NULL THEN
    INSERT INTO quiz_questions (subject_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, class_level) VALUES
    (ai_id, 'What does AI stand for?', 'Automated Intelligence', 'Artificial Intelligence', 'Anonymous Intelligence', 'Applied Intelligence', 'B', 'AI stands for Artificial Intelligence, referring to machines programmed to think and learn like humans.', 'easy', 'Class 6-10'),
    (ai_id, 'Which language is widely used for AI and Machine Learning?', 'Java', 'C++', 'Python', 'Ruby', 'C', 'Python is the most popular language for AI due to its extensive libraries and simple syntax.', 'easy', 'Class 6-10'),
    (ai_id, 'What is a neural network conceptually based on?', 'Computer circuits', 'The human brain', 'Mathematical trees', 'Social networks', 'B', 'Neural networks are inspired by the biological neural networks that constitute human brains.', 'medium', 'Class 8-12'),
    (ai_id, 'Which of these is an example of Narrow AI?', 'Siri/Alexa', 'Skynet', 'A human-level android', 'None of the above', 'A', 'Narrow AI is designed for specific tasks. Siri and Alexa are Narrow AIs. General AI (human-level) does not yet exist.', 'medium', 'Class 6-10'),
    (ai_id, 'What does NLP stand for in AI?', 'Natural Logic Processing', 'Neural Language Program', 'Natural Language Processing', 'Network Learning Process', 'C', 'Natural Language Processing allows computers to understand, interpret, and manipulate human language.', 'easy', 'Class 8-12'),
    (ai_id, 'Who is known as the father of computer science and AI?', 'Alan Turing', 'Bill Gates', 'Steve Jobs', 'Charles Babbage', 'A', 'Alan Turing was a mathematician, logician, and computer scientist who laid the groundwork for modern computing and AI.', 'medium', 'Class 9-12'),
    (ai_id, 'What is machine learning?', 'A machine repairing itself', 'A program that explicitly dictates rules', 'Systems that learn from data to improve', 'Robotic physical training', 'C', 'Machine learning is a subset of AI where systems learn from data to identify patterns and make decisions without explicit programming.', 'medium', 'Class 6-10'),
    (ai_id, 'What is the Turing Test used for?', 'Testing computer speed', 'Measuring battery life', 'Determining if a machine can exhibit intelligent behavior', 'Securing passwords', 'C', 'The Turing Test, developed by Alan Turing, tests a machine''s ability to exhibit intelligent behavior indistinguishable from a human.', 'medium', 'Class 9-12'),
    (ai_id, 'Which AI pioneer coined the term "Artificial Intelligence"?', 'John McCarthy', 'Marvin Minsky', 'Geoffrey Hinton', 'Andrew Ng', 'A', 'John McCarthy coined the term "Artificial Intelligence" in 1955 for the Dartmouth Conference.', 'hard', 'Class 11-12'),
    (ai_id, 'What is deep learning a subset of?', 'Data Mining', 'Machine Learning', 'Quantum Computing', 'Web Development', 'B', 'Deep learning is a subset of machine learning based on artificial neural networks with multiple layers.', 'medium', 'Class 9-12'),
    (ai_id, 'Which neural network architecture is primarily used for image recognition?', 'RNN (Recurrent Neural Network)', 'CNN (Convolutional Neural Network)', 'GAN (Generative Adversarial Network)', 'Transformer', 'B', 'CNNs are highly effective for processing grid-like data such as images.', 'hard', 'Class 11-12'),
    (ai_id, 'What does GAN stand for?', 'General Artificial Network', 'Generative Adversarial Network', 'Gradient Applied Nodes', 'Graphic Array Node', 'B', 'GANs consist of two networks, a generator and a discriminator, competing against each other.', 'hard', 'Class 11-12'),
    (ai_id, 'Which company developed the AI program AlphaGo?', 'OpenAI', 'Microsoft', 'Google DeepMind', 'IBM', 'C', 'AlphaGo was developed by DeepMind Technologies (acquired by Google), heavily utilizing reinforcement learning.', 'easy', 'Class 8-12'),
    (ai_id, 'In machine learning, what does "overfitting" mean?', 'Training a model too fast', 'A model memorizing training data but failing on new data', 'Having too much data', 'Running out of memory on the GPU', 'B', 'Overfitting happens when a model learns the detail and noise in the training data to the extent that it negatively impacts its performance on new data.', 'hard', 'Class 11-12'),
    (ai_id, 'What do you call the data used to teach a machine learning model?', 'Teaching set', 'Learning dataset', 'Training data', 'Input pool', 'C', 'Training data is the initial dataset used to train the algorithm to make predictions or perform tasks.', 'easy', 'Class 6-10'),
    (ai_id, 'What kind of AI is ChatGPT?', 'Reinforcement AI', 'Generative AI', 'Predictive AI', 'Robotic AI', 'B', 'ChatGPT is a prominent example of Generative AI, designed to create new text based on the prompts it receives.', 'easy', 'Class 6-10'),
    (ai_id, 'What is the fundamental unit of data in binary code?', 'Byte', 'Bit', 'Nibble', 'Pixel', 'B', 'A bit (binary digit) is the smallest unit of data in a computer, representing a 0 or 1.', 'easy', 'Class 4-8'),
    (ai_id, 'Which of the following describes an unsupervised learning algorithm?', 'Requires labeled data', 'Finds hidden patterns in unlabeled data', 'Learns through a reward system', 'Uses explicit programming logic', 'B', 'Unsupervised learning algorithms find hidden structures and patterns in data that has not been labeled or classified.', 'medium', 'Class 9-12'),
    (ai_id, 'What is the full form of API?', 'Application Programming Interface', 'Automated Program Input', 'Artificial Programming Intelligence', 'Application Process Integration', 'A', 'An API (Application Programming Interface) allows different software applications to communicate with each other.', 'medium', 'Class 8-12'),
    (ai_id, 'Which sorting algorithm is usually the fastest for large datasets?', 'Bubble Sort', 'Insertion Sort', 'Quick Sort', 'Selection Sort', 'C', 'Quick Sort typically performs the fastest on large datasets on average, though Merge Sort is also very efficient.', 'hard', 'Class 11-12'),
    (ai_id, 'What does the term "Big Data" refer to?', 'Large physical hard drives', 'Datasets too large for traditional processing', 'Data generated by big tech companies only', 'Data stored on mainframes', 'B', 'Big Data refers to vast and complex datasets that require advanced, non-traditional data processing applications.', 'medium', 'Class 8-12'),
    (ai_id, 'In AI terminology, an "epoch" refers to:', 'A specific era in computing history', 'One complete pass of the training dataset through the algorithm', 'The moment an AI gains consciousness', 'A type of neural network layer', 'B', 'An epoch is when an entire dataset is passed forward and backward through the neural network exactly once.', 'hard', 'Class 11-12'),
    (ai_id, 'What algorithm was famously used to defeat chess champion Garry Kasparov?', 'Deep Blue (Minimax with alpha-beta pruning)', 'AlphaZero (MCTS)', 'Stockfish', 'ChatGPT', 'A', 'IBM''s Deep Blue, which used a parallelized alpha-beta search algorithm, defeated Kasparov in 1997.', 'medium', 'Class 9-12'),
    (ai_id, 'Which tag is used to create a hyperlink in HTML?', '<link>', '<a>', '<href>', '<hyper>', 'B', 'The <a> tag defines a hyperlink, which is used to link from one page to another.', 'easy', 'Class 6-10'),
    (ai_id, 'What is the primary function of an operating system?', 'To compile code', 'To browse the internet', 'To manage computer hardware and software resources', 'To protect from viruses', 'C', 'An OS manages the computer''s memory and processes, as well as all of its software and hardware.', 'easy', 'Class 6-10');
  END IF;

  -- Insert Robotics Questions
  IF robo_id IS NOT NULL THEN
    INSERT INTO quiz_questions (subject_id, question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, class_level) VALUES
    (robo_id, 'What defines a robot?', 'A machine that looks exactly like a human', 'A machine capable of carrying out a complex series of actions automatically', 'Any machine powered by electricity', 'A software program running on a server', 'B', 'A robot is a programmable machine capable of carrying out complex actions automatically.', 'easy', 'Class 6-10'),
    (robo_id, 'Which component acts as the "brain" of a robot?', 'Actuator', 'Sensor', 'Microcontroller/Processor', 'Battery', 'C', 'The microcontroller or processor interprets signals from sensors and sends commands to the actuators, functioning as the brain.', 'easy', 'Class 6-10'),
    (robo_id, 'Isaac Asimov formulated the Three Laws of Robotics. Which is the First Law?', 'A robot must protect its own existence', 'A robot may not injure a human being', 'A robot must obey orders given by human beings', 'A robot must never lie', 'B', 'The First Law: A robot may not injure a human being or, through inaction, allow a human being to come to harm.', 'medium', 'Class 8-12'),
    (robo_id, 'What does an actuator do in a robot?', 'Provides power', 'Senses the environment', 'Creates physical movement', 'Stores data', 'C', 'Actuators are the components (like motors) that convert electrical energy into physical motion.', 'medium', 'Class 8-12'),
    (robo_id, 'Which widely used open-source framework is standard in robotics research?', 'ROS (Robot Operating System)', 'Android OS', 'Arduino IDE', 'RoboCode', 'A', 'ROS is an open-source, flexible framework for writing robot software.', 'hard', 'Class 11-12'),
    (robo_id, 'What type of sensor would a robot use to measure its rotation/tilt?', 'Ultrasonic sensor', 'Gyroscope', 'Infrared sensor', 'Lidar', 'B', 'A gyroscope measures the angular velocity and orientation (tilt/rotation) of the robot.', 'medium', 'Class 9-12'),
    (robo_id, 'What does LIDAR stand for?', 'Light Image Detection and Ranging', 'Laser Infrared Data Analysis Record', 'Light Detection and Ranging', 'Linear Distance and Ranging', 'C', 'LIDAR (Light Detection and Ranging) is a remote sensing method that uses pulsed lasers to measure ranges.', 'medium', 'Class 11-12'),
    (robo_id, 'What is the term for a robot designed to resemble a human?', 'Cyborg', 'Drone', 'Humanoid', 'Rover', 'C', 'A humanoid robot is a robot with its body shape built to resemble the human body.', 'easy', 'Class 6-10'),
    (robo_id, 'What is kinematics in robotics?', 'The study of the forces that cause motion', 'The study of motion without considering forces', 'The programming language of robots', 'The electrical wiring system', 'B', 'Kinematics is the branch of mechanics describing the motion of points, bodies, and systems of bodies without considering the forces that cause them.', 'hard', 'Class 11-12'),
    (robo_id, 'Which robotics company created the famous backflipping robot "Atlas"?', 'Boston Dynamics', 'iRobot', 'Honda', 'Tesla', 'A', 'Boston Dynamics is known for creating highly advanced, dynamic robots like Atlas and Spot.', 'easy', 'Class 8-12'),
    (robo_id, 'What is a servo motor primarily used for?', 'Continuous fast rotation', 'Generating electricity', 'Precise angular positioning', 'Cooling down the robot', 'C', 'Servo motors allow for precise control of angular or linear position, velocity, and acceleration.', 'medium', 'Class 8-12'),
    (robo_id, 'Which of the following is an example of an end effector?', 'The robot''s battery', 'The robot''s camera', 'A robotic gripper or welding torch', 'The robot''s wheels', 'C', 'An end effector is the device at the end of a robotic arm designed to interact with the environment (e.g., grippers, paint guns).', 'medium', 'Class 9-12'),
    (robo_id, 'What does DOF stand for in robotics?', 'Degrees of Freedom', 'Direction of Force', 'Distance of Field', 'Direct Overload Factor', 'A', 'Degrees of Freedom (DOF) refer to the specific number of independent parameters that define a robot''s configuration.', 'medium', 'Class 11-12'),
    (robo_id, 'In robotics, what is "SLAM"?', 'System Logic And Mathematics', 'Simultaneous Localization and Mapping', 'Sound Localization and Movement', 'Sensory Laser Alignment Module', 'B', 'SLAM is the computational problem of constructing or updating a map of an unknown environment while simultaneously keeping track of an agent''s location within it.', 'hard', 'Class 11-12'),
    (robo_id, 'A robot that relies entirely on a pre-programmed sequence is called:', 'Autonomous', 'Teleoperated', 'Scripted/Automated', 'Cognitive', 'C', 'Scripted or purely automated robots simply execute a predefined sequence of commands without adapting to the environment.', 'medium', 'Class 8-12'),
    (robo_id, 'What is a "cyborg"?', 'A completely mechanical being', 'An organism with both biological and artificial/electronic parts', 'A computer virus', 'A robot built for manufacturing', 'B', 'A cyborg (cybernetic organism) is a being with both organic and biomechatronic body parts.', 'easy', 'Class 6-10'),
    (robo_id, 'Which component allows a robot to detect distance using sound waves?', 'Infrared Sensor', 'LIDAR', 'Ultrasonic Sensor', 'Thermistor', 'C', 'Ultrasonic sensors measure distance by sending out sound waves and measuring how long it takes for the echo to return.', 'easy', 'Class 6-10'),
    (robo_id, 'What does an encoder do on a robot''s motor?', 'Increases the motor''s speed', 'Converts AC to DC power', 'Measures the motor''s position or speed', 'Cools down the motor shaft', 'C', 'An encoder translates the mechanical motion (rotation) of the motor into electrical signals to determine speed and position.', 'hard', 'Class 11-12'),
    (robo_id, 'Who introduced the word "robot" in a 1920 play?', 'Isaac Asimov', 'Nikola Tesla', 'Karel Čapek', 'Alan Turing', 'C', 'The word "robot" was introduced by Czech writer Karel Čapek in his play R.U.R. (Rossum''s Universal Robots).', 'medium', 'Class 9-12'),
    (robo_id, 'What is the main advantage of omnidirectional wheels (like Mecanum wheels)?', 'They are cheaper to manufacture', 'They allow the robot to move in any direction instantly', 'They last longer than rubber tires', 'They provide the highest speed on rough terrain', 'B', 'Mecanum wheels allow a robot to move forward, backward, sideways, and diagonally without turning its chassis.', 'medium', 'Class 8-12'),
    (robo_id, 'Which famous rover landed on Mars in 2021 carrying the Ingenuity helicopter?', 'Curiosity', 'Opportunity', 'Spirit', 'Perseverance', 'D', 'The Perseverance rover landed on Mars in February 2021, featuring advanced robotics and carrying the Ingenuity helicopter.', 'easy', 'Class 6-10'),
    (robo_id, 'What type of robot is typically used in car assembly lines?', 'Swarm robots', 'Humanoid robots', 'Articulated robotic arms', 'Medical nanobots', 'C', 'Articulated robotic arms, with rotary joints, are heavily used in industrial manufacturing like car assembly.', 'easy', 'Class 6-10'),
    (robo_id, 'In an Arduino, what voltage do the digital logic pins typically operate at?', '110V', '12V', '5V or 3.3V', '24V', 'C', 'Standard Arduino boards (like the Uno) operate at 5V logic, while many newer boards operate at 3.3V.', 'medium', 'Class 8-12'),
    (robo_id, 'What is teleoperation?', 'Operating a robot via telephone cables', 'A robot operating completely on its own', 'Controlling a robot from a distance by a human operator', 'A process where robots communicate with each other', 'C', 'Teleoperation indicates operation of a machine at a distance, usually involving a human controller (e.g., remote-controlled drones).', 'easy', 'Class 6-10'),
    (robo_id, 'What does "payload" mean in the context of drones and robotic arms?', 'The software uploaded to the robot', 'The maximum carrying capacity (weight)', 'The battery life remaining', 'The total cost of the robot', 'B', 'Payload is the carrying capacity of an aircraft or launch vehicle, usually measured in terms of weight.', 'easy', 'Class 6-10');
  END IF;

  -- Create a Sample Competition Test if both subjects exist
  IF ai_id IS NOT NULL AND robo_id IS NOT NULL THEN
    INSERT INTO quizzes (
      title, slug, subject_id, description, quiz_type, cadence, 
      questions_per_attempt, time_limit_seconds, total_questions_in_bank, is_active
    ) VALUES (
      'Ultimate Robotics & AI Challenge', 
      'ultimate-robotics-ai-challenge', 
      robo_id, 
      'A highly competitive test covering hardware robotics logic. See if you can conquer the leaderboard!', 
      'Competition', 
      'Weekly', 
      10, 
      600, 
      25, 
      true
    ) RETURNING id INTO new_quiz_id;

    -- Create the first period for this quiz
    INSERT INTO quiz_periods (quiz_id, period_number, period_label, start_time, end_time)
    VALUES (
      new_quiz_id, 
      1, 
      'Week 1', 
      now(), 
      now() + interval '7 days'
    );
  END IF;

END $$;
