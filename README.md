## Awesome Google Tasks
Alternative Web UI for Google Tasks made with React

### Why?
Google Tasks is awesome, and it has a [beautiful mobile app](https://play.google.com/store/apps/details?id=com.google.android.apps.tasks&hl=en), but for some reason, [someone in Google completely forgot the Web UI in the 90's](https://mail.google.com/tasks/canvas).
I couldn't stand aside watching the wasted potential, so I took matters into my own hands and created this web app.

### What?
Awesome Google Tasks is a web client for Google Tasks. We use Google's public API to query and modify your tasks, so that anything you see in the mobile app and the original website is available through Awesome Google Tasks, and vice-versa.
This project does not have a server side, we do nothing with your data but sending it back and forward from Google to your browser, it's important to me to clarify that this is just a client app.

You can use Awesome Google Tasks to do almost anything you can do with the original client, with the exception of reording tasks, creating sub-tasks and moving tasks between lists.
These features are planned to be implemented in the future. 
If you find any other differences between Awesome Google Tasks to the official clients, please [create an issue](https://github.com/bluzi/awesome-google-tasks/issues).

### How?
Awesome Google Tasks is implemented using React and [bluzi/google-tasks-api](https://github.com/bluzi/google-tasks-api).
You can use [bluzi/google-tasks-api](https://github.com/bluzi/google-tasks-api) to create your own client, or to create other services that integrate with Google Tasks.
I've tried to make it easier to communicate with Google Tasks API, as I found it pretty over-complicated.
Feel free to browse the code and ask questions by [creating issues](https://github.com/bluzi/awesome-google-tasks/issues) or by mail (eliran013@gmail.com), one aspect of this repository is to be a sample app for such integrations. 

### Contributions
Plesae feel free to ask for features by [creating issues](https://github.com/bluzi/awesome-google-tasks/issues), or to implement features by [creating pull requests](https://github.com/bluzi/awesome-google-tasks/pulls).
I'll do my best to review things as fast as I can, as I always try to do.

If you find any errors or strange behaviors, please report them by [creating an issue](https://github.com/bluzi/awesome-google-tasks/issues).

### License
This project is licensed under the MIT License.