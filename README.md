# Connect 4

This is a project built as part of FreeCodeCamp's cirriculum. The original project is meant to be an AI-less Tic-Tac-Toe game but I've made about three of those before so I decided to put my own personal spin on it. I decided to make it a Connect 4 game to give myself an extra challenge and I also decided to implement an AI! I did my research and learned about minimaxing with alpha-beta pruning and implemented it. Essentially the AI doesn't play to win so much as it plays to make the player lose: if there's a choice where the AI can win but it can also lose or it can go down a path that means a draw for both parties, then it'll play for the draw. This apparently is something only third or fourth year Computer Science students learn as an elective so I was really proud I was able to teach myself this. 

I also worked hard to make the UI great: initially I had buttons below the board for each column when I first made this project months ago. Now I have it so the user can click on any space in an empty column and it'll add their piece to its column. 


## To Do

* Implement machine learning to allow the AI to learn from its mistakes using Tensorflow
* Implement an AI vs AI mode that would use machine learning
* Implement a room based multiplayer system where players can play eachother online
* Implement match making for room based multiplayer (instead of sending a link to the room to the friend)
* Implement a statistics board (record matches, how long did it take to set  up this move, what's the most popular 4 spots for a win, etc.)

## User Stories

User Story: As a user I can add my piece to a column. 

User Story: When I take my turn, either the AI automatically takes its turn or another player gets their chance to place their piece

User Story: When the game is over I can restart the game and it'll wipe the board. 

User Story: As a user I can choose between playing against an AI or playing against another human in local multiplayer

User Story: The game automatically detects when I or the opposing player has won and will show the winning move, show who won, and stop the game. 

User Story: The AI can have different difficulty levels and they can be changed

User Story: I can choose to go second or first and I can choose if I want my chip to be black or red. 

## Authors

* **Nicolas Crumrine** - *EVERYTHING* - [CrumrineCoder](https://github.com/CrumrineCoder)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Gimu and c4arena for inspiration on the project revision. My father for helping with the direction of the project. These resources were especially helpful in my research: https://www.cs.cornell.edu/courses/cs312/2002sp/lectures/rec21.htm and https://www.youtube.com/watch?v=zp3VMe0Jpf8. 
