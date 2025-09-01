# Database Population Scripts

This directory contains comprehensive scripts to populate your Nexus database with realistic sample data for testing and development purposes.

## 🚀 Quick Start

To populate your entire database with sample data, run:

```bash
python manage.py populate_all
```

This will run all population scripts in the correct order and give you a fully populated database.

## 📋 Available Population Scripts

### 1. `populate_all` - Master Script
**Command:** `python manage.py populate_all`

Runs all population scripts in the correct order:
- Tags → Users → Enhanced Updates → Chats → System Messages → Basic Updates

### 2. `populate_tags` - Foundation Tags
**Command:** `python manage.py populate_tags`

Creates 20 predefined tags organized into categories:
- **Production**: efficiency, quality, safety, maintenance, training
- **Technology**: automation, digital, iot, ai, data
- **Company**: announcement, policy, event, recognition, update
- **Industry**: market, competition, regulation, innovation, partnership

### 3. `populate_users` - User Accounts
**Command:** `python manage.py populate_users`

Creates 15 realistic user accounts across different departments:
- **Executive Team**: CEO, CFO, CTO
- **Technology Team**: Senior Engineer, Frontend Developer, Backend Developer
- **Operations Team**: Operations Manager, Production Supervisor
- **Sales & Marketing**: Sales Director, Marketing Manager
- **HR Team**: HR Manager
- **Quality Assurance**: QA Engineer
- **Customer Support**: Support Specialist
- **Research & Development**: Research Scientist
- **Legal & Compliance**: Legal Counsel

**Default Password:** `nexus123` for all users

### 4. `populate_enhanced_updates` - Rich Company Updates
**Command:** `python manage.py populate_enhanced_updates`

Creates 10 comprehensive company updates with:
- **Production Updates**: New production line, maintenance schedules
- **Technology Updates**: AI platform release, cybersecurity training
- **HR Updates**: Wellness program expansion, remote work policy
- **Sales Updates**: Record-breaking quarter achievements
- **Quality Updates**: ISO certifications, environmental achievements
- **R&D Updates**: Sustainable materials breakthrough
- **Market Updates**: International expansion strategies

Each update includes:
- Rich, realistic content
- Appropriate tags and categories
- Attachments (PDFs, documents)
- Media (images, screenshots)
- Proper timestamps and priorities

### 5. `populate_chats` - Conversations & Messages
**Command:** `python manage.py populate_chats`

Creates realistic chat conversations:
- **Individual Chats**: 10 direct message conversations between users
- **Group Chats**: 5 team-based group conversations
  - Technology Team
  - Operations Hub
  - Company Announcements
  - Project Alpha
  - Sales & Marketing

Each chat includes:
- Natural conversation flow
- Work-related discussions
- Realistic timestamps
- Multiple participants (for group chats)

### 6. `populate_system_messages` - System Notifications
**Command:** `python manage.py populate_system_messages`

Creates various system messages for each user:
- **Welcome Messages**: Account setup, platform introduction
- **Security Notifications**: Password expiry, login alerts
- **System Updates**: Maintenance schedules, new features
- **Training Notifications**: Available courses, completion certificates
- **Company Announcements**: Meetings, achievements
- **Work Notifications**: Project assignments, deadlines
- **Error Notifications**: Upload failures, connection issues
- **Reminders**: Profile updates, document expiry
- **Social Features**: Connection requests, networking

### 7. `populate_updates` - Basic Updates (Legacy)
**Command:** `python manage.py populate_updates`

Creates 5 basic system updates (included for backward compatibility).

## 🔄 Running Individual Scripts

You can run any script individually if you only need specific data:

```bash
# Only populate users
python manage.py populate_users

# Only populate chats
python manage.py populate_chats

# Only populate system messages
python manage.py populate_system_messages
```

## 📊 Expected Database State After Population

After running `populate_all`, you should have:

- **~15 Users** across different departments
- **~20 Tags** organized by category
- **~15 Updates** (10 enhanced + 5 basic)
- **~15 Chats** (10 individual + 5 group)
- **~50+ Messages** in conversations
- **~200+ System Messages** distributed across users
- **~20+ Attachments** (PDFs, documents)
- **~10+ Media** (images, screenshots)

## 🛠️ Customization

### Adding More Users
Edit `populate_users.py` and add new user entries to the `users_data` list.

### Adding More Tags
Edit `populate_tags.py` and add new tag entries to the `initial_tags` list.

### Adding More Updates
Edit `populate_enhanced_updates.py` and add new update entries to the `enhanced_updates_data` list.

### Modifying Content
All scripts use realistic sample data that you can customize to match your company's:
- Department structure
- Job titles
- Company policies
- Industry focus
- Communication style

## 🚨 Important Notes

1. **Run in Order**: Always run `populate_all` or ensure dependencies are met:
   - Tags must exist before creating updates
   - Users must exist before creating chats/messages

2. **Password Security**: All users are created with password `nexus123` - change these in production!

3. **Data Overwrite**: Scripts use `get_or_create` to avoid duplicates, but existing data may be updated.

4. **External URLs**: Sample data includes placeholder URLs - replace with real content in production.

5. **Database Size**: These scripts create substantial amounts of data - ensure your database can handle it.

## 🔧 Troubleshooting

### Common Issues

**"No users found" Error**
- Run `populate_users` first
- Check if Django is properly configured

**"No tags found" Error**
- Run `populate_tags` first
- Verify Tag model exists

**Permission Errors**
- Ensure you have database write permissions
- Check Django user permissions

**Memory Issues**
- Run scripts individually instead of `populate_all`
- Consider reducing the number of records created

### Debug Mode

Add `--verbosity=2` to see detailed output:

```bash
python manage.py populate_all --verbosity=2
```

## 📈 Performance Considerations

- **Large Datasets**: These scripts create hundreds of records - may take several minutes
- **Database Indexes**: Ensure proper database indexing for large datasets
- **Batch Processing**: Consider running during off-peak hours for production systems

## 🎯 Use Cases

These population scripts are perfect for:

- **Development Environments**: Quickly populate test databases
- **Demo Purposes**: Showcase platform capabilities
- **Testing**: Test various features with realistic data
- **Training**: Provide examples for new team members
- **Staging**: Prepare staging environments for testing

## 📝 Contributing

To add new population scripts:

1. Create a new file in `management/commands/`
2. Inherit from `BaseCommand`
3. Follow the naming convention `populate_*.py`
4. Add to `populate_all.py` in the correct order
5. Update this README with documentation

---

**Happy Populating! 🎉**

Your Nexus database will be rich with realistic, interconnected data that makes development and testing much more engaging.
