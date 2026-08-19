package com.devlog.backend.member.interest;

import com.devlog.backend.member.Member;
import com.devlog.backend.tag.TechnologyTag;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "member_interests",
    uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "tag_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MemberInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "tag_id", nullable = false)
    private TechnologyTag tag;

    @Column(nullable = false)
    private int sortOrder;

    private MemberInterest(Member member, TechnologyTag tag, int sortOrder) {
        this.member = member;
        this.tag = tag;
        this.sortOrder = sortOrder;
    }

    public static MemberInterest create(Member member, TechnologyTag tag, int sortOrder) {
        return new MemberInterest(member, tag, sortOrder);
    }
}
