import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { WatchlistComponent } from './watchlist.component';
describe('WatchlistComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [WatchlistComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(WatchlistComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=watchlist.component.spec.js.map