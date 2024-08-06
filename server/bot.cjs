const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const schedule = require('node-schedule');
const bcrypt = require('bcrypt');
const axios = require('axios');
const Task = require('./models/Task.cjs'); 
const Project = require('./models/Project.cjs');
const User = require('./models/Users.cjs');
const LocalSession = require('telegraf-session-local');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
mongoose.connect(`mongodb+srv://${encodeURIComponent(process.env.MONGO_USER)}:${encodeURIComponent(process.env.MONGO_PASSWORD)}@vanessa.cmfcsdg.mongodb.net/task-manager?retryWrites=true&w=majority&appName=vanessa`);

function scheduleReminders(task, telegramId) {
    const reminders = [
        { days: 7, text: '1 week' },
        { days: 3, text: '3 days' },
        { days: 1, text: '1 day' },
    ];

    reminders.forEach(({ days, text }) => {
        const reminderDate = new Date(task.dueDate);
        reminderDate.setDate(reminderDate.getDate() - days);

        if (reminderDate > new Date()) {
            schedule.scheduleJob(reminderDate, async () => {
                const refreshedTask = await Task.findById(task._id);
                if (!refreshedTask.completed) {
                    bot.telegram.sendMessage(telegramId, `Reminder: Task "${task.title}" is due in ${text}.`);
                }
            });
        }
    });
}

bot.use((new LocalSession({ database: 'telebot_db.json' })).middleware());

bot.command('start', (ctx) => {
    console.log('Start command received');
    ctx.reply('Please Login before sending commands  (￣￢￣ヾ)\nEnter your email\n  or \nSignup via the GetItDone site');
    ctx.session.state = 'waiting_for_email';
});

bot.command('help', (ctx) => {
    console.log('Help command received');
    ctx.reply('(⚈∇⚈ ) I can perform the following commands:\n /start to start the bot\n /help to list commands\n /viewtasks to view all incomplete tasks\n /viewalltasks to view all incomplete tasks and subtasks\n /markcomplete to mark a task or subtask as complete\n /joke to get a random joke');
});

bot.command('viewtasks', async (ctx) => {    
    if (!ctx.session || ctx.session.state !== 'authenticated') {
        ctx.reply('Please Login before sending commands  (￣￢￣ヾ)\nEnter your email\n  or \nSignup via the GetItDone site');
        ctx.session.state = 'waiting_for_email';
        return;
    }

    console.log('User authenticated:', ctx.session.user);

    try {
        const currentDate = new Date();
        const projects = await Project.find({
            userID: ctx.session.user._id,
            startDate: { $lte: currentDate.toISOString() },
            endDate: { $gte: currentDate.toISOString() }
        }).populate('tasks');

        if (projects.length === 0) {
            ctx.reply('No ongoing projects found.');
        } else {
            const isTaskCompleted = (task) => {
                return task.completed || (task.subTasks.length > 0 && task.subTasks.every(subTask => subTask.completed));
            };

            let message = 'Ongoing Projects and Incomplete Tasks:\n\n';
            projects.forEach(project => {
                message += `*${project.title}*\n`;
                const incompleteTasks = project.tasks.filter(task => !isTaskCompleted(task));
                if (incompleteTasks.length > 0) {
                    incompleteTasks.forEach(task => {
                        message += `  - ${task.title} (Due: ${task.dueDate})\n`;
                    });
                } else {
                    message += '  No incomplete tasks.\n';
                }
                message += '\n';
            });
            ctx.replyWithMarkdown(message.trim());
        }
    } catch (error) {
        console.error('Error in viewtasks command:', error);
        ctx.reply('An error occurred while fetching tasks. Please try again later.');
    }
});

bot.command('viewalltasks', async (ctx) => {    
    if (!ctx.session || ctx.session.state !== 'authenticated') {
        ctx.reply('Please Login before sending commands  (￣￢￣ヾ)\nEnter your email\n  or \nSignup via the GetItDone site');
        ctx.session.state = 'waiting_for_email';
        return;
    }

    console.log('User authenticated:', ctx.session.user);

    try {
        const currentDate = new Date();
        const projects = await Project.find({
            userID: ctx.session.user._id,
            startDate: { $lte: currentDate.toISOString() },
            endDate: { $gte: currentDate.toISOString() }
        }).populate('tasks');

        if (projects.length === 0) {
            ctx.reply('No ongoing projects found.');
        } else {
            const isTaskCompleted = (task) => {
                return task.completed || (task.subTasks.length > 0 && task.subTasks.every(subTask => subTask.completed));
            };

            let message = 'Ongoing Projects and Incomplete Tasks:\n\n';
            projects.forEach(project => {
                message += `*${project.title}*\n`;
                const incompleteTasks = project.tasks.filter(task => !isTaskCompleted(task));
                if (incompleteTasks.length > 0) {
                    incompleteTasks.forEach(task => {
                        message += `  - ${task.title} (Due: ${task.dueDate})\n`;
                        if (task.subTasks.length > 0) {
                            task.subTasks.forEach(subTask => {
                                if (!subTask.completed) {
                                    message += `    - Subtask: ${subTask.title}\n`;
                                }
                            });
                        }
                    });
                } else {
                    message += '  No incomplete tasks.\n';
                }
                message += '\n';
            });
            ctx.replyWithMarkdown(message.trim());
        }
    } catch (error) {
        console.error('Error in viewtasks command:', error);
        ctx.reply('An error occurred while fetching tasks. Please try again later.');
    }
});

bot.command('markcomplete', async (ctx) => {
    if (!ctx.session || ctx.session.state !== 'authenticated') {
        ctx.reply('Please Login before sending commands  (￣￢￣ヾ)\nEnter your email\n  or \nSignup via the GetItDone site');
        ctx.session.state = 'waiting_for_email';
        return;
    }

    ctx.reply('Which task or subtask would you like to mark as complete?')
    ctx.session.state = 'waiting_for_task';
});

bot.command('joke', async (ctx) => {
    console.log('Joke command received');
    
    try {
        const response = await axios.get('https://official-joke-api.appspot.com/random_joke');
        console.log('API response:', response.data);

        const joke = response.data;
        ctx.reply(`${joke.setup}\n${joke.punchline}`);
    } catch (error) {
        console.error('Error fetching joke:', error);
        ctx.reply('An error occurred while fetching a joke. Please try again later.');
    }
});

bot.hears(['hello', 'Hello', 'HELLO', 'hi', 'Hi', 'HI'], async (ctx) => {
    await ctx.reply('hello ヽ (°◇° )ノ')
});

bot.on('text', async (ctx) => {
    console.log('Text received:', ctx.message.text);
    
    if (ctx.session.state === 'waiting_for_email') {
        const email = ctx.message.text;
        const user = await User.findOne({ email });

        if (!user) {
            ctx.reply('Email not found. Please try again.');
            return;
        }

        ctx.session.user = user;
        ctx.session.state = 'waiting_for_password';
        ctx.reply('Please enter your password ');
    } else if (ctx.session.state === 'waiting_for_password') {
        const password = ctx.message.text;

        const isPasswordCorrect = await bcrypt.compare(password, ctx.session.user.password);
        if (!isPasswordCorrect) {
            ctx.reply('Incorrect password. Please try again.');
            ctx.session.state = 'waiting_for_email';
            ctx.session.user = null;
            return;
        }

        ctx.reply(`Welcome ${ctx.session.user.username}!`);
        ctx.session.state = 'authenticated';

        const currentDate = new Date();
        const projects = await Project.find({
            userID: ctx.session.user._id,
            startDate: { $lte: currentDate.toISOString() },
            endDate: { $gte: currentDate.toISOString() }
        }).populate('tasks');

        if (projects.length === 0) {
            ctx.reply('No ongoing projects found.');
        } else {
            const isTaskCompleted = (task) => {
                return task.completed || (task.subTasks.length > 0 && task.subTasks.every(subTask => subTask.completed));
            };

            let message = 'Ongoing Projects and Incomplete Tasks:\n\n';
            projects.forEach(project => {
                message += `*${project.title}*\n`;
                const incompleteTasks = project.tasks.filter(task => !isTaskCompleted(task));
                if (incompleteTasks.length > 0) {
                    incompleteTasks.forEach(task => {
                        message += `  - ${task.title} (Due: ${task.dueDate})\n`;
                    });
                } else {
                    message += '  No incomplete tasks.\n';
                }
                message += '\n';
            });
            ctx.replyWithMarkdown(message.trim());
        }
    } else if (ctx.session.state === 'waiting_for_task') {
        const taskTitle = ctx.message.text.trim();
        try {
            const task = await Task.findOne({
                $or: [
                    { title: taskTitle },
                    { 'subTasks.title': taskTitle }
                ],
                projectID: { $in: await Project.find({ userID: ctx.session.user._id }).select('_id') }
            });
    
            if (!task) {
                ctx.reply('Task or subtask not found. Please try again with a valid task or subtask title.');
                return;
            }
    
            if (task.title === taskTitle) {
                task.completed = true;
                await task.save();
                ctx.reply(`${taskTitle} has been marked as complete.`);
            } else {
                const subtask = task.subTasks.find(st => st.title === taskTitle);
                if (subtask) {
                    subtask.completed = true;
                    await task.save();
                    ctx.reply(`${taskTitle} has been marked as complete.`);
                } else {
                    ctx.reply('Subtask not found. Please try again with a valid subtask title.');
                }
            }
            
            ctx.session.state = 'authenticated';
        } catch (error) {
            console.error('Error marking task as complete:', error);
            ctx.reply('An error occurred while marking the task as complete. Please try again later.');
        }
    }
});

bot.catch((err, ctx) => {
    console.error('Ooops', err);
    ctx.reply('An error occurred');
});

(async () => {
    try {
        const tasks = await Task.find({ completed: false });
        const users = await User.find({});
        
        users.forEach(user => {
            const userTasks = tasks.filter(task => {
                if (!task.userID) {
                    console.warn(`Task ${task._id} has no userID`);
                    return false;
                }
                return task.userID.toString() === user._id.toString();
            });
            
            userTasks.forEach(task => {
                if (user.telegramId) {
                    scheduleReminders(task, user.telegramId);
                } else {
                    console.warn(`User ${user._id} has no telegramId`);
                }
            });
        });
        
        console.log('Reminders scheduled successfully');
    } catch (error) {
        console.error('Error scheduling reminders:', error);
    }
})();

bot.launch();
console.log('Bot started...');