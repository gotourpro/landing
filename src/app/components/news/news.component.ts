import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LayoutService } from '../../services/layout.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-news',
    standalone: true,
    templateUrl: './news.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, FormsModule, TranslateModule]
})
export class NewsComponent {
    public storageKey: string = 'gotiva';
    public readonly enabled = false;
    public announcement: any;

    constructor(
        private configService: LayoutService,
        private cd: ChangeDetectorRef
    ) {

        const news = {
            "id": 1,
            "content": "The site is under development",
            "linkText": "Learn More",
            "linkHref": "['/theming']"
        };

        afterNextRender(() => {
            const itemString = localStorage.getItem(this.storageKey);

            if (itemString) {
                const item = JSON.parse(itemString);

                if (!item.hiddenNews || item.hiddenNews !== news.id) {
                    this.configService.newsActive.set(true);
                    this.announcement = {};
                } else {
                    this.configService.newsActive.set(false);
                }
            } else {
                this.configService.newsActive.set(false);
                this.announcement = news;
            }
            this.cd.markForCheck();
        });
    }

    get isNewsActive(): boolean {
        return this.configService.newsActive();
    }

    hideNews() {
        this.configService.hideNews();
        const item = {
            hiddenNews: this.announcement.id
        };

        localStorage.setItem(this.storageKey, JSON.stringify(item));
    }
}
