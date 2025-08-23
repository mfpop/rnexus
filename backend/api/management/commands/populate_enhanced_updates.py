import random
from datetime import timedelta

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand
from django.utils import timezone

from api.models import Tag, Update, UpdateAttachment, UpdateMedia


class Command(BaseCommand):
    help = "Populate the database with enhanced sample updates for testing"

    def handle(self, *args, **options):
        # Get users for creating updates
        users = list(User.objects.all())
        if len(users) == 0:
            self.stdout.write(
                self.style.ERROR("No users found. Run populate_users first.")
            )
            return

        # Get existing tags
        tags = list(Tag.objects.all())
        if len(tags) == 0:
            self.stdout.write(
                self.style.ERROR("No tags found. Run populate_tags first.")
            )
            return

        # Enhanced updates data with realistic company content
        enhanced_updates_data = [
            # Production & Operations Updates
            {
                "id": "update_prod_001",
                "type": "news",
                "title": "New Production Line Successfully Launched",
                "summary": "Our state-of-the-art production line has been successfully launched, increasing capacity by 40%.",
                "body": "We're excited to announce the successful launch of our new automated production line! This $2.5 million investment represents a significant milestone in our manufacturing capabilities. The new line features advanced robotics, real-time quality monitoring, and energy-efficient processes that align with our sustainability goals. Initial testing shows a 40% increase in production capacity while maintaining our high quality standards. The team has worked tirelessly over the past 8 months to make this happen, and we're incredibly proud of their achievement.",
                "status": "new",
                "tags": ["production", "efficiency", "innovation", "quality"],
                "author": "Lisa Wang",
                "icon": "🏭",
                "priority": 8,
                "timestamp": timezone.now() - timedelta(hours=4),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/production-line-specs.pdf",
                        "label": "Production Line Specifications",
                    }
                ],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/production-line-photo.jpg",
                        "label": "New Production Line",
                    }
                ],
            },
            {
                "id": "update_prod_002",
                "type": "alert",
                "title": "Scheduled Maintenance - Building A",
                "summary": "Building A will undergo scheduled maintenance on Friday, affecting production lines 1-3.",
                "body": "Please be advised that Building A will undergo scheduled maintenance this Friday from 6:00 PM to 2:00 AM. This maintenance will affect production lines 1-3 and is necessary to ensure optimal performance and safety. During this time, production will be shifted to Building B. All affected employees have been notified of the schedule change. We apologize for any inconvenience and appreciate your understanding as we work to maintain our equipment at peak performance.",
                "status": "new",
                "tags": ["maintenance", "production", "safety"],
                "author": "Tom Johnson",
                "icon": "🔧",
                "priority": 6,
                "timestamp": timezone.now() - timedelta(hours=8),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/maintenance-schedule.pdf",
                        "label": "Maintenance Schedule",
                    }
                ],
                "media": [],
            },
            # Technology Updates
            {
                "id": "update_tech_001",
                "type": "news",
                "title": "AI-Powered Analytics Platform Released",
                "summary": "Our new AI analytics platform provides real-time insights into production efficiency and quality metrics.",
                "body": "We're thrilled to announce the release of our new AI-powered analytics platform! This cutting-edge system uses machine learning algorithms to analyze production data in real-time, providing actionable insights that help optimize efficiency and maintain quality standards. The platform integrates with our existing systems and offers intuitive dashboards for all team members. Key features include predictive maintenance alerts, quality trend analysis, and performance benchmarking. This represents a significant step forward in our digital transformation journey and demonstrates our commitment to leveraging technology for competitive advantage.",
                "status": "new",
                "tags": ["technology", "ai", "data", "automation"],
                "author": "Mike Chen",
                "icon": "🤖",
                "priority": 9,
                "timestamp": timezone.now() - timedelta(hours=12),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/ai-platform-user-guide.pdf",
                        "label": "User Guide",
                    }
                ],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/ai-dashboard-screenshot.png",
                        "label": "AI Dashboard Preview",
                    }
                ],
            },
            {
                "id": "update_tech_002",
                "type": "communication",
                "title": "Cybersecurity Training Mandatory for All Staff",
                "summary": "New cybersecurity training module is now mandatory for all employees to complete by month-end.",
                "body": "In light of recent industry cybersecurity threats, we're implementing mandatory cybersecurity training for all employees. This comprehensive training covers phishing awareness, password security, data protection, and incident reporting procedures. The training module is available online and must be completed by the end of this month. Completion certificates will be required for continued system access. This initiative reflects our commitment to protecting company and customer data. Please prioritize this training and contact IT support if you encounter any technical issues.",
                "status": "urgent",
                "tags": ["security", "training", "technology", "policy"],
                "author": "Mike Chen",
                "icon": "🔒",
                "priority": 12,
                "timestamp": timezone.now() - timedelta(hours=2),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/cybersecurity-training.pdf",
                        "label": "Training Materials",
                    }
                ],
                "media": [],
            },
            # Company & HR Updates
            {
                "id": "update_hr_001",
                "type": "news",
                "title": "Employee Wellness Program Expansion",
                "summary": "We're expanding our wellness program to include mental health support, fitness classes, and nutrition counseling.",
                "body": "We're excited to announce the expansion of our employee wellness program! Starting next month, we'll be offering comprehensive mental health support through our partnership with a leading mental health provider, on-site fitness classes three times per week, and personalized nutrition counseling. These additions reflect our commitment to supporting the holistic well-being of our team members. The program is available to all employees and their families. We believe that healthy, happy employees are more productive and engaged, and we're committed to creating a workplace that supports both professional and personal growth.",
                "status": "new",
                "tags": ["company", "wellness", "hr", "benefits"],
                "author": "Rachel Brown",
                "icon": "💚",
                "priority": 7,
                "timestamp": timezone.now() - timedelta(hours=16),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/wellness-program-details.pdf",
                        "label": "Program Details",
                    }
                ],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/wellness-center-photo.jpg",
                        "label": "Wellness Center",
                    }
                ],
            },
            {
                "id": "update_hr_002",
                "type": "communication",
                "title": "New Remote Work Policy Effective Immediately",
                "summary": "Updated remote work policy allows flexible hybrid arrangements for eligible positions.",
                "body": "We're pleased to announce our updated remote work policy, effective immediately! This new policy allows eligible employees to work in a hybrid arrangement, combining office and remote work based on their role and team needs. The policy includes guidelines for communication, collaboration tools, and performance expectations. We believe this flexibility will improve work-life balance while maintaining productivity and team cohesion. All managers will receive training on managing remote teams, and we'll provide the necessary technology and support to ensure success. Please review the policy document and discuss any questions with your manager or HR.",
                "status": "new",
                "tags": ["policy", "hr", "remote-work", "company"],
                "author": "Rachel Brown",
                "icon": "🏠",
                "priority": 8,
                "timestamp": timezone.now() - timedelta(hours=20),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/remote-work-policy.pdf",
                        "label": "Remote Work Policy",
                    }
                ],
                "media": [],
            },
            # Sales & Marketing Updates
            {
                "id": "update_sales_001",
                "type": "news",
                "title": "Record-Breaking Quarter for Sales Team",
                "summary": "Our sales team achieved 125% of their quarterly target, setting a new company record.",
                "body": "Congratulations to our incredible sales team for achieving 125% of their quarterly target! This outstanding performance represents a 25% increase over last quarter and sets a new company record. The team's success is attributed to their dedication, innovative approach to customer relationships, and the quality of our products and services. Key highlights include expanding into three new markets, securing partnerships with major retailers, and achieving the highest customer satisfaction scores in our history. This success directly contributes to our company's growth and stability, and we're incredibly proud of the entire sales organization.",
                "status": "read",
                "tags": ["sales", "achievement", "company", "growth"],
                "author": "Anna Garcia",
                "icon": "🎯",
                "priority": 9,
                "timestamp": timezone.now() - timedelta(days=1),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/q3-sales-report.pdf",
                        "label": "Q3 Sales Report",
                    }
                ],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/sales-team-celebration.jpg",
                        "label": "Sales Team Celebration",
                    }
                ],
            },
            # Quality & Compliance Updates
            {
                "id": "update_quality_001",
                "type": "news",
                "title": "ISO 14001 Environmental Certification Achieved",
                "summary": "We've successfully achieved ISO 14001 certification for environmental management systems.",
                "body": "We're proud to announce that we've successfully achieved ISO 14001:2015 certification for our environmental management systems! This certification recognizes our commitment to environmental responsibility and sustainable business practices. The certification process involved a comprehensive audit of our environmental policies, procedures, and performance. Key achievements include reducing our carbon footprint by 30% over the past two years, implementing comprehensive recycling programs, and developing sustainable supply chain practices. This certification not only validates our environmental efforts but also positions us as a leader in sustainable manufacturing. We're committed to continuous improvement in our environmental performance.",
                "status": "read",
                "tags": ["quality", "certification", "environment", "sustainability"],
                "author": "Sam Davis",
                "icon": "🌱",
                "priority": 8,
                "timestamp": timezone.now() - timedelta(days=2),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/iso-14001-certificate.pdf",
                        "label": "ISO 14001 Certificate",
                    }
                ],
                "media": [],
            },
            # Research & Development Updates
            {
                "id": "update_rd_001",
                "type": "news",
                "title": "Breakthrough in Sustainable Materials Research",
                "summary": "Our R&D team has developed a new biodegradable material that could revolutionize our product line.",
                "body": "We're excited to announce a major breakthrough in our sustainable materials research! Our R&D team has successfully developed a new biodegradable material that maintains the strength and durability of traditional materials while being completely environmentally friendly. This innovation has the potential to revolutionize our entire product line and significantly reduce our environmental impact. The material has undergone extensive testing and meets all industry standards for safety and performance. We're currently in the process of patenting this technology and exploring partnerships for large-scale production. This breakthrough represents years of dedicated research and demonstrates our commitment to innovation and sustainability.",
                "status": "new",
                "tags": ["research", "innovation", "sustainability", "technology"],
                "author": "Kevin Taylor",
                "icon": "🔬",
                "priority": 10,
                "timestamp": timezone.now() - timedelta(hours=6),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/research-paper.pdf",
                        "label": "Research Paper",
                    }
                ],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/material-testing.jpg",
                        "label": "Material Testing",
                    }
                ],
            },
            # Customer & Market Updates
            {
                "id": "update_market_001",
                "type": "communication",
                "title": "New Market Expansion Strategy Announced",
                "summary": "We're expanding into three new international markets with localized product offerings.",
                "body": "We're excited to announce our expansion into three new international markets! This strategic expansion represents a significant milestone in our global growth strategy. We'll be entering markets in Southeast Asia, Latin America, and Eastern Europe with localized product offerings tailored to each region's specific needs and preferences. This expansion includes establishing local partnerships, adapting our products to meet regional requirements, and building dedicated customer support teams. We believe these markets offer significant growth potential and align with our long-term strategic objectives. This expansion will create new opportunities for our team members and strengthen our position as a global leader in our industry.",
                "status": "new",
                "tags": ["market", "expansion", "strategy", "growth"],
                "author": "James Wilson",
                "icon": "🌍",
                "priority": 9,
                "timestamp": timezone.now() - timedelta(hours=10),
                "attachments": [
                    {
                        "type": "pdf",
                        "url": "https://example.com/market-expansion-plan.pdf",
                        "label": "Expansion Plan",
                    }
                ],
                "media": [
                    {
                        "type": "image",
                        "url": "https://example.com/global-markets-map.png",
                        "label": "Global Markets Map",
                    }
                ],
            },
        ]

        created_count = 0
        updated_count = 0

        # Create enhanced updates
        for update_data in enhanced_updates_data:
            # Extract attachments and media
            attachments_data = update_data.pop("attachments")
            media_data = update_data.pop("media")

            # Get a random user as the creator
            created_by = random.choice(users)

            # Create the update
            update, created = Update.objects.get_or_create(
                id=update_data["id"], defaults={**update_data, "created_by": created_by}
            )

            if created:
                # Create attachments
                for att_data in attachments_data:
                    UpdateAttachment.objects.create(update=update, **att_data)

                # Create media
                for med_data in media_data:
                    UpdateMedia.objects.create(update=update, **med_data)

                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"Created enhanced update: {update.title}")
                )
            else:
                # Update existing update
                for key, value in update_data.items():
                    if key != "id" and hasattr(update, key):
                        setattr(update, key, value)

                update.created_by = created_by
                update.save()

                # Update attachments and media if they exist
                if attachments_data:
                    UpdateAttachment.objects.filter(update=update).delete()
                    for att_data in attachments_data:
                        UpdateAttachment.objects.create(update=update, **att_data)

                if media_data:
                    UpdateMedia.objects.filter(update=update).delete()
                    for med_data in media_data:
                        UpdateMedia.objects.create(update=update, **med_data)

                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f"Updated enhanced update: {update.title}")
                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nSuccessfully processed enhanced updates:\n"
                f"Created: {created_count}\n"
                f"Updated: {updated_count}"
            )
        )

        # Display summary
        total_updates = Update.objects.count()
        news_updates = Update.objects.filter(type="news").count()
        alert_updates = Update.objects.filter(type="alert").count()
        communication_updates = Update.objects.filter(type="communication").count()

        self.stdout.write(
            self.style.SUCCESS(
                f"\nEnhanced Updates Summary:\n"
                f"Total Updates: {total_updates}\n"
                f"News Updates: {news_updates}\n"
                f"Alert Updates: {alert_updates}\n"
                f"Communication Updates: {communication_updates}"
            )
        )
